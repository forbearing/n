package model_keycloak

import "github.com/forbearing/golib/model"

type RelamRole struct {
	model.Base
}

func (*RelamRole) TableName() string {
	return "keycloak_realm_roles"
}
