package configx

type Keycloak struct {
	Addr string `mapstructure:"addr" default:"http://localhost:8080"`
}
