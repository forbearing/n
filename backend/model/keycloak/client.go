package model_keycloak

import "github.com/forbearing/golib/model"

type Client struct {
	model.Base
}

func (*Client) TableName() string {
	return "keycloak_clients"
}
