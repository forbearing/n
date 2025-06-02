package cronjobx

import (
	"context"
	"encoding/json"

	"nebula/configx"
	model_keycloak "nebula/model/keycloak"

	"github.com/Nerzal/gocloak/v13"
	"github.com/forbearing/golib/config"
	"github.com/forbearing/golib/cronjob"
	"github.com/forbearing/golib/database"
	"github.com/forbearing/golib/model"
	"github.com/forbearing/golib/util"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

func Init() error {
	cronjob.Register(func() error {
		admin := gocloak.NewClient(config.Get[configx.Keycloak](configx.KEYCLOAK).Addr)
		ctx := context.Background()
		token, err := admin.LoginAdmin(ctx, "admin", "admin", "master")
		if err != nil {
			return err
		}

		// realms
		if err := database.DB.Transaction(func(tx *gorm.DB) error {
			_realms, err := admin.GetRealms(ctx, token.AccessToken)
			if err != nil {
				return err
			}
			newRealms := make([]*model_keycloak.Realm, 0)
			for _, r := range _realms {
				data, _ := json.Marshal(r)
				newRealms = append(newRealms, &model_keycloak.Realm{
					Base:        model.Base{ID: util.Deref(r.ID)},
					Name:        r.Realm,
					DisplayName: r.DisplayName,
					Enabled:     r.Enabled,
					Data:        datatypes.JSON(data),
				})
			}
			oldRealms := make([]*model_keycloak.Realm, 0)
			if err := database.Database[*model_keycloak.Realm]().WithTransaction(tx).WithLock().WithLimit(-1).List(&oldRealms); err != nil {
				return err
			}
			if err := database.Database[*model_keycloak.Realm]().WithTransaction(tx).WithLock().WithLimit(-1).WithPurge().Delete(oldRealms...); err != nil {
				return err
			}
			if err := database.Database[*model_keycloak.Realm]().WithTransaction(tx).WithLock().WithLimit(-1).Create(newRealms...); err != nil {
				return err
			}
			return nil
		}); err != nil {
			return err
		}

		return nil
	}, "*/10 * * * * *", "sync keyloack")

	return nil
}
