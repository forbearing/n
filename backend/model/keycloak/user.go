package model_keycloak

import "github.com/forbearing/golib/model"

type User struct {
	model.Base
}

func (*User) TableName() string {
	return "keycloak_users"
}
