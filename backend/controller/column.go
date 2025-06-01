package controller

import (
	"github.com/forbearing/golib/controller"
	. "github.com/forbearing/golib/response"
	"github.com/forbearing/golib/types/consts"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

type column struct{}

var Column = new(column)

var columnMachine = []string{
	"hostname",
	"ip_address",
	"email",
	"owner",
	"cpu",
	"memory",
	"storage",
	"network",
	"project_name",
	"vendor_name",
}

func (c *column) Get(ctx *gin.Context) {
	switch ctx.Param(consts.PARAM_ID) {
	case "machine":
		controller.Column.GetColumns(ctx, "machines", columnMachine)
	default:
		zap.S().Warn("unknow id: ", ctx.Param(consts.PARAM_ID))
		ResponseJSON(ctx, CodeSuccess)
	}
}
