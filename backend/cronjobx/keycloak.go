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
	"go.uber.org/multierr"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

func RegisterKeycloak() {
	cronjob.Register(func() error {
		var (
			_realms    []*gocloak.RealmRepresentation
			_clients   []*gocloak.Client
			_users     []*gocloak.User
			_groups    []*gocloak.Group
			newRealms  = make([]*model_keycloak.Realm, 0)
			oldRealms  = make([]*model_keycloak.Realm, 0)
			newClients = make([]*model_keycloak.Client, 0)
			oldClients = make([]*model_keycloak.Client, 0)
			newUsers   = make([]*model_keycloak.User, 0)
			oldUsers   = make([]*model_keycloak.User, 0)
			newGroups  = make([]*model_keycloak.Group, 0)
			oldGroups  = make([]*model_keycloak.Group, 0)
		)

		// 1.拿到 keycloak admin token
		admin := gocloak.NewClient(config.Get[configx.Keycloak](configx.KEYCLOAK).Addr)
		ctx := context.Background()
		token, err := admin.LoginAdmin(ctx, "admin", "admin", "master")
		if err != nil {
			return err
		}

		// 2.获取所有的 realm
		if _realms, err = admin.GetRealms(ctx, token.AccessToken); err != nil {
			return err
		}
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
		// 3.获取所有的 client, user, group
		for _, r := range _realms {
			if _clients, err = admin.GetClients(ctx, token.AccessToken, util.Deref(r.Realm), gocloak.GetClientsParams{Max: util.ValueOf(-1)}); err != nil {
				return err
			}
			if _users, err = admin.GetUsers(ctx, token.AccessToken, util.Deref(r.Realm), gocloak.GetUsersParams{Max: util.ValueOf(-1)}); err != nil {
				return err
			}
			if _groups, err = admin.GetGroups(ctx, token.AccessToken, util.Deref(r.Realm), gocloak.GetGroupsParams{Max: util.ValueOf(-1)}); err != nil {
				return err
			}
			for _, c := range _clients {
				data, _ := json.Marshal(r)
				newClients = append(newClients, &model_keycloak.Client{
					Base:      model.Base{ID: util.Deref(c.ID)},
					Name:      c.Name,
					RealmId:   r.ID,
					RealmName: r.Realm,
					Data:      datatypes.JSON(data),
				})
			}
			for _, u := range _users {
				data, _ := json.Marshal(r)
				newUsers = append(newUsers, &model_keycloak.User{
					Base:          model.Base{ID: util.Deref(u.ID)},
					Username:      u.Username,
					Email:         u.Email,
					Enabled:       u.Enabled,
					EmailVerified: u.EmailVerified,
					FirstName:     u.FirstName,
					LastName:      u.LastName,
					RealmId:       r.ID,
					RealmName:     r.Realm,
					Data:          datatypes.JSON(data),
				})
			}
			for _, g := range _groups {
				data, _ := json.Marshal(r)
				newGroups = append(newGroups, &model_keycloak.Group{
					Base:      model.Base{ID: util.Deref(g.ID)},
					Name:      g.Name,
					Path:      g.Path,
					RealmId:   r.ID,
					RealmName: r.Realm,
					Data:      datatypes.JSON(data),
				})
			}
		}

		// 4.在数据库中更新 realms
		e1 := database.DB.Transaction(func(tx *gorm.DB) error {
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
		})
		// 5.在数据库中更新 client
		e2 := database.DB.Transaction(func(tx *gorm.DB) error {
			if err := database.Database[*model_keycloak.Client]().WithTransaction(tx).WithLock().WithLimit(-1).List(&oldClients); err != nil {
				return err
			}
			if err := database.Database[*model_keycloak.Client]().WithTransaction(tx).WithLock().WithLimit(-1).WithPurge().Delete(oldClients...); err != nil {
				return err
			}
			if err := database.Database[*model_keycloak.Client]().WithTransaction(tx).WithLock().WithLimit(-1).Create(newClients...); err != nil {
				return err
			}
			return nil
		})
		// 6.在数据库中更新 user
		e3 := database.DB.Transaction(func(tx *gorm.DB) error {
			if err := database.Database[*model_keycloak.User]().WithTransaction(tx).WithLock().WithLimit(-1).List(&oldUsers); err != nil {
				return err
			}
			if err := database.Database[*model_keycloak.User]().WithTransaction(tx).WithLock().WithLimit(-1).WithPurge().Delete(oldUsers...); err != nil {
				return err
			}
			if err := database.Database[*model_keycloak.User]().WithTransaction(tx).WithLock().WithLimit(-1).Create(newUsers...); err != nil {
				return err
			}
			return nil
		})

		// 7.在数据库中更新 group
		e4 := database.DB.Transaction(func(tx *gorm.DB) error {
			if err := database.Database[*model_keycloak.Group]().WithTransaction(tx).WithLock().WithLimit(-1).List(&oldGroups); err != nil {
				return err
			}
			if err := database.Database[*model_keycloak.Group]().WithTransaction(tx).WithLock().WithLimit(-1).WithPurge().Delete(oldGroups...); err != nil {
				return err
			}
			if err := database.Database[*model_keycloak.Group]().WithTransaction(tx).WithLock().WithLimit(-1).Create(newGroups...); err != nil {
				return err
			}
			return nil
		})

		return multierr.Combine(e1, e2, e3, e4)
	}, "*/10 * * * * *", "sync keyloack")
}
