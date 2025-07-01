package main

import (
	"os"

	"nebula/configx"
	"nebula/constx"
	"nebula/controller"
	"nebula/cronjobx"
	model_cmdb "nebula/model/cmdb"
	model_keycloak "nebula/model/keycloak"
	model_setting "nebula/model/setting"
	model_system "nebula/model/system"
	_ "nebula/service"
	_ "nebula/service/cmdb"

	"github.com/forbearing/golib/bootstrap"
	"github.com/forbearing/golib/config"
	"github.com/forbearing/golib/model"
	"github.com/forbearing/golib/router"
	_ "github.com/forbearing/golib/service"
	"github.com/forbearing/golib/types/consts"
	"github.com/forbearing/golib/util"
)

func main() {
	// database environment
	// NOTE: you should always set environment in docker-compose.yaml or k8s env.
	os.Setenv(config.DATABASE_TYPE, string(config.DBMySQL))
	os.Setenv(config.MYSQL_DATABASE, constx.MYSQL_DATABASE)
	os.Setenv(config.MYSQL_PORT, "3307")
	os.Setenv(config.MYSQL_USERNAME, constx.MYSQL_USERNAME)
	os.Setenv(config.MYSQL_PASSWORD, constx.MYSQL_PASSWORD)
	// logger environment
	os.Setenv(config.LOGGER_DIR, "/tmp/nebula/logs")
	// keycloak environment
	os.Setenv(configx.KEYCLOAK_ADDR, "http://localhost:8003")

	bootstrap.Register(
		configx.Init,
		cronjobx.Init,
	)
	util.RunOrDie(bootstrap.Bootstrap)

	router.API().GET("/column/:id", controller.Column.Get)
	router.Register[*model_system.Menu](router.API(), "menu")
	router.Register[*model.TableColumn](router.API(), "table_column", consts.List, consts.UpdatePartial)

	cmdb := router.API().Group("cmdb")
	router.Register[*model_cmdb.Machine](cmdb, "machine", consts.Most, consts.Import)
	router.Register[*model_cmdb.DNS](cmdb, "dns", consts.Most, consts.Import)

	setting := router.API().Group("setting")
	router.Register[*model_setting.Project](setting, "project", consts.List)
	router.Register[*model_setting.Vendor](setting, "vendor", consts.List)
	router.Register[*model_setting.Region](setting, "region", consts.List)

	keycloak := router.API().Group("keycloak")
	router.Register[*model_keycloak.User](keycloak, "user", consts.List)
	router.Register[*model_keycloak.Client](keycloak, "client", consts.List)
	router.Register[*model_keycloak.Group](keycloak, "group", consts.List)
	router.Register[*model_keycloak.Realm](keycloak, "realm", consts.List)

	util.RunOrDie(bootstrap.Run)
}
