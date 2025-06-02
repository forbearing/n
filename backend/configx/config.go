package configx

import "github.com/forbearing/golib/config"

const (
	KEYCLOAK_ADDR = "KEYCLOAK_ADDR"
	KEYCLOAK      = "keycloak"
)

func Init() error {
	config.Register[Keycloak](KEYCLOAK)

	return nil
}
