package model_keycloak

import "github.com/forbearing/golib/model"

type Realm struct {
	model.Base
}

func (*Realm) TableName() string {
	return "keycloak_realms"
}
