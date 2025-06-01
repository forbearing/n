package main

import (
	"os"

	"nebula/consts"
	"nebula/controller"
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
	"github.com/forbearing/golib/util"
)

func main() {
	// database environment
	// NOTE: you should always set environment in docker-compose.yaml or k8s env.
	os.Setenv(config.DATABASE_TYPE, string(config.DBMySQL))
	os.Setenv(config.MYSQL_DATABASE, consts.MYSQL_DATABASE)
	os.Setenv(config.MYSQL_PORT, "3307")
	os.Setenv(config.MYSQL_USERNAME, consts.MYSQL_USERNAME)
	os.Setenv(config.MYSQL_PASSWORD, consts.MYSQL_PASSWORD)
	// logger environment
	os.Setenv(config.LOGGER_DIR, "/tmp/nebula/logs")

	util.RunOrDie(bootstrap.Bootstrap)

	router.API().GET("/column/:id", controller.Column.Get)
	router.Register[*model_system.Menu](router.API(), "menu")
	router.RegisterList[*model.TableColumn](router.API(), "table_column")
	router.RegisterUpdatePartial[*model.TableColumn](router.API(), "table_column")

	cmdb := router.API().Group("cmdb")
	router.Register[*model_cmdb.Machine](cmdb, "machine")
	router.RegisterImport[*model_cmdb.Machine](cmdb, "machine")
	router.RegisterImport[*model_cmdb.DNS](cmdb, "dns")

	setting := router.API().Group("setting")
	router.RegisterList[*model_setting.Project](setting, "project")
	router.RegisterList[*model_setting.Vendor](setting, "vendor")
	router.RegisterList[*model_setting.Region](setting, "region")

	keycloak := router.API().Group("keycloak")
	router.RegisterList[*model_keycloak.User](keycloak, "user")
	router.RegisterList[*model_keycloak.Client](keycloak, "client")
	router.RegisterList[*model_keycloak.Group](keycloak, "group")
	router.RegisterList[*model_keycloak.Realm](keycloak, "realm")

	util.RunOrDie(bootstrap.Run)
}
