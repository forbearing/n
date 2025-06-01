package model_keycloak

import (
	"github.com/forbearing/golib/model"
	"gorm.io/datatypes"
)

type Client struct {
	// RealmID 客户端所属的 Realm
	// 与 ClientID 组合形成唯一索引
	RealmID string `json:"realm_id,omitempty" gorm:"type:varchar(36);uniqueIndex:idx_realm_client,priority:1;not null"`

	// Access 定义客户端的访问权限映射
	// 包含各种访问控制设置，如是否可以查看、管理等
	// 示例: {"view": true, "configure": true, "manage": false}
	Access datatypes.JSONType[map[string]interface{}] `json:"access,omitempty" gorm:"type:json"`

	// AdminURL 是客户端的管理界面 URL
	// 用于 Keycloak 管理控制台中快速访问客户端的管理页面
	// 示例: "https://myapp.example.com/admin"
	AdminURL *string `json:"admin_url,omitempty" gorm:"type:varchar(255)"`

	// Attributes 是客户端的自定义属性映射
	// 可存储任意额外配置信息，如自定义设置、元数据等
	// 示例: {"custom_setting": "value", "api_version": "v2"}
	Attributes datatypes.JSONType[map[string]string] `json:"attributes,omitempty" gorm:"type:json"`

	// AuthenticationFlowBindingOverrides 认证流程绑定覆盖配置
	// 允许为特定的认证流程指定自定义的流程，覆盖默认设置
	// 键是流程类型(如 browser, direct_grant)，值是自定义流程的ID
	// 示例: {"browser": "custom-browser-flow-id", "direct_grant": "custom-direct-grant-flow-id"}
	AuthenticationFlowBindingOverrides datatypes.JSONType[map[string]string] `json:"authentication_flow_binding_overrides,omitempty" gorm:"type:json"`

	// AuthorizationServicesEnabled 是否启用授权服务
	// true: 启用细粒度的授权服务（需要额外配置资源、策略、权限）
	// false: 仅使用基本的角色授权
	AuthorizationServicesEnabled *bool `json:"authorization_services_enabled,omitempty" gorm:"type:boolean;default:false"`

	// // AuthorizationSettings 授权服务的详细设置
	// // 当 AuthorizationServicesEnabled 为 true 时有效
	// // 包含资源服务器的配置，如资源、策略、权限等
	// AuthorizationSettings datatypes.JSONType[*ResourceServerRepresentation] `json:"authorization_settings,omitempty" gorm:"type:json"`

	// BaseURL 客户端的基础 URL
	// 用于构建其他相对 URL，如重定向 URI
	// 示例: "https://myapp.example.com"
	BaseURL *string `json:"base_url,omitempty" gorm:"type:varchar(255)"`

	// BearerOnly 是否为仅持有者令牌模式
	// true: 客户端仅验证持有者令牌，不进行登录（适用于 API 服务）
	// false: 客户端可以发起登录流程
	BearerOnly *bool `json:"bearer_only,omitempty" gorm:"type:boolean;default:false"`

	// ClientAuthenticatorType 客户端认证器类型
	// 定义客户端如何向 Keycloak 进行身份验证
	// 常见值: "client-secret"（默认）, "client-jwt", "client-x509"
	ClientAuthenticatorType *string `json:"client_authenticator_type,omitempty" gorm:"type:varchar(255);default:'client-secret'"`

	// ClientID 客户端的唯一标识符
	// 在同一个 realm 中必须唯一，用于 OAuth2/OIDC 流程
	// 示例: "my-web-app", "mobile-app", "backend-service"
	ClientID *string `json:"client_id,omitempty" gorm:"type:varchar(255);uniqueIndex:idx_realm_client,priority:2"`

	// ConsentRequired 是否需要用户同意
	// true: 用户首次访问时需要明确同意授权
	// false: 自动授权，不显示同意页面
	ConsentRequired *bool `json:"consent_required,omitempty" gorm:"type:boolean;default:false"`

	// DefaultClientScopes 默认客户端作用域列表
	// 客户端默认请求的作用域，用户无需明确请求
	// 示例: ["openid", "profile", "email"]
	DefaultClientScopes datatypes.JSONType[[]string] `json:"default_client_scopes,omitempty" gorm:"type:json"`

	// DefaultRoles 客户端的默认角色列表
	// 通过此客户端认证的用户自动获得的角色
	// 示例: ["user", "viewer"]
	DefaultRoles datatypes.JSONType[[]string] `json:"default_roles,omitempty" gorm:"type:json"`

	// Description 客户端的描述信息
	// 用于在管理界面和用户同意页面显示
	// 示例: "公司内部员工管理系统"
	Description *string `json:"description,omitempty" gorm:"type:text"`

	// DirectAccessGrantsEnabled 是否启用直接访问授权（资源所有者密码凭证流）
	// true: 允许用户直接使用用户名密码获取令牌（不推荐）
	// false: 必须通过标准的授权码流程
	DirectAccessGrantsEnabled *bool `json:"direct_access_grants_enabled,omitempty" gorm:"type:boolean;default:false"`

	// Enabled 客户端是否启用
	// true: 客户端正常工作
	// false: 客户端被禁用，所有请求都会被拒绝
	Enabled *bool `json:"enabled,omitempty" gorm:"type:boolean;default:true"`

	// FrontChannelLogout 是否支持前端通道登出
	// true: 支持通过前端（浏览器）进行登出
	// false: 仅支持后端通道登出
	FrontChannelLogout *bool `json:"frontchannel_logout,omitempty" gorm:"type:boolean;default:false"`

	// FullScopeAllowed 是否允许完整作用域
	// true: 客户端可以使用 realm 中的所有角色映射
	// false: 仅能使用明确分配给客户端的角色
	FullScopeAllowed *bool `json:"full_scope_allowed,omitempty" gorm:"type:boolean;default:true"`

	// ID 客户端的内部唯一标识符
	// 由 Keycloak 自动生成的 UUID
	// 示例: "3f7d5f1a-b4c6-4d8e-9f1a-2b3c4d5e6f7a"
	ID *string `json:"id,omitempty" gorm:"type:varchar(36);primaryKey"`

	// ImplicitFlowEnabled 是否启用隐式流程
	// true: 支持隐式授权流程（已不推荐使用）
	// false: 不支持隐式流程
	ImplicitFlowEnabled *bool `json:"implicit_flow_enabled,omitempty" gorm:"type:boolean;default:false"`

	// Name 客户端的显示名称
	// 在用户界面中显示的友好名称
	// 示例: "员工管理系统"
	Name *string `json:"name,omitempty" gorm:"type:varchar(255)"`

	// NodeReRegistrationTimeout 节点重新注册超时时间（秒）
	// 集群环境中，节点断开连接后重新注册的超时时间
	// -1 表示使用默认值，0 表示立即超时
	NodeReRegistrationTimeout *int32 `json:"node_re_registration_timeout,omitempty" gorm:"type:int"`

	// NotBefore 令牌生效时间戳
	// 在此时间之前签发的令牌都被视为无效
	// 用于令牌撤销场景
	NotBefore *int32 `json:"not_before,omitempty" gorm:"type:int"`

	// OptionalClientScopes 可选客户端作用域列表
	// 客户端可以请求但不是默认包含的作用域
	// 示例: ["address", "phone", "offline_access"]
	OptionalClientScopes datatypes.JSONType[[]string] `json:"optional_client_scopes,omitempty" gorm:"type:json"`

	// Origin 客户端的来源
	// 标识客户端是如何创建的
	// 示例: "admin-api", "registration", "import"
	Origin *string `json:"origin,omitempty" gorm:"type:varchar(255)"`

	// Protocol 客户端使用的协议
	// 定义客户端使用的认证协议
	// 常见值: "openid-connect", "saml"
	Protocol *string `json:"protocol,omitempty" gorm:"type:varchar(255);default:'openid-connect'"`

	// ProtocolMappers 协议映射器配置列表
	// 定义如何将用户属性、角色等映射到令牌中
	// 每个映射器定义一个映射规则
	ProtocolMappers datatypes.JSONType[[]ProtocolMapperRepresentation] `json:"protocol_mappers,omitempty" gorm:"type:json"`

	// PublicClient 是否为公开客户端
	// true: 公开客户端（如 SPA、移动应用），不使用客户端密钥
	// false: 机密客户端，需要客户端密钥
	PublicClient *bool `json:"public_client,omitempty" gorm:"type:boolean;default:false"`

	// RedirectURIs 允许的重定向 URI 列表
	// OAuth2/OIDC 授权后允许重定向的 URI
	// 支持通配符 (*)，示例: ["https://myapp.com/callback", "https://myapp.com/*"]
	RedirectURIs datatypes.JSONType[[]string] `json:"redirect_uris,omitempty" gorm:"type:json"`

	// RegisteredNodes 已注册节点映射
	// 集群环境中记录客户端在各节点的注册信息
	// 键是节点名，值是注册时间戳
	RegisteredNodes datatypes.JSONType[map[string]int] `json:"registered_nodes,omitempty" gorm:"type:json"`

	// RegistrationAccessToken 注册访问令牌
	// 用于动态客户端注册协议
	// 允许客户端更新自己的配置
	RegistrationAccessToken *string `json:"registration_access_token,omitempty" gorm:"type:text"`

	// RootURL 客户端的根 URL
	// 用作其他 URL 的基础，优先级高于 BaseURL
	// 示例: "https://myapp.example.com"
	RootURL *string `json:"root_url,omitempty" gorm:"type:varchar(255)"`

	// Secret 客户端密钥
	// 机密客户端用于身份验证的密钥
	// 仅在 PublicClient 为 false 时使用
	Secret *string `json:"secret,omitempty" gorm:"type:varchar(255)"`

	// ServiceAccountsEnabled 是否启用服务账户
	// true: 为客户端创建关联的服务账户用户
	// 允许客户端使用客户端凭证流获取自己的访问令牌
	ServiceAccountsEnabled *bool `json:"service_accounts_enabled,omitempty" gorm:"type:boolean;default:false"`

	// StandardFlowEnabled 是否启用标准流程（授权码流程）
	// true: 支持标准的 OAuth2 授权码流程
	// false: 不支持授权码流程
	StandardFlowEnabled *bool `json:"standard_flow_enabled,omitempty" gorm:"type:boolean;default:true"`

	// SurrogateAuthRequired 是否需要代理认证
	// true: 需要额外的认证步骤
	// false: 标准认证流程
	SurrogateAuthRequired *bool `json:"surrogate_auth_required,omitempty" gorm:"type:boolean;default:false"`

	// WebOrigins 允许的 Web 来源列表
	// 用于 CORS 配置，定义哪些来源可以访问客户端
	// 支持通配符 (+)，"+" 表示允许所有重定向 URI 的来源
	// 示例: ["https://myapp.com", "https://app.myapp.com", "+"]
	WebOrigins datatypes.JSONType[[]string] `json:"web_origins,omitempty" gorm:"type:json"`

	model.Base
}

// ProtocolMapperRepresentation represents....
type ProtocolMapperRepresentation struct {
	Config          *map[string]string `json:"config,omitempty"`
	ID              *string            `json:"id,omitempty"`
	Name            *string            `json:"name,omitempty"`
	Protocol        *string            `json:"protocol,omitempty"`
	ProtocolMapper  *string            `json:"protocol_mapper,omitempty"`
	ConsentRequired *bool              `json:"consent_required,omitempty"`
}

func (*Client) TableName() string {
	return "keycloak_clients"
}
