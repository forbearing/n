package model_keycloak

import "github.com/forbearing/golib/model"

type ClientScope struct {
	model.Base
}

func (*ClientScope) TableName() string {
	return "keycloak_client_scopes"
}
