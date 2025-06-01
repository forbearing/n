package model_keycloak

import "github.com/forbearing/golib/model"

type Group struct {
	model.Base
}

func (*Group) TableName() string {
	return "keycloak_groups"
}
