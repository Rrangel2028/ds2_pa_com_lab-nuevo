"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioSchema = exports.Usuario = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var mongoose_2 = require("mongoose");
var mongoose_3 = require("mongoose");
var Usuario = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({
            timestamps: true
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _classSuper = mongoose_3.Document;
    var _username_decorators;
    var _username_initializers = [];
    var _username_extraInitializers = [];
    var _email_decorators;
    var _email_initializers = [];
    var _email_extraInitializers = [];
    var _role_decorators;
    var _role_initializers = [];
    var _role_extraInitializers = [];
    var _phone_decorators;
    var _phone_initializers = [];
    var _phone_extraInitializers = [];
    var _password_decorators;
    var _password_initializers = [];
    var _password_extraInitializers = [];
    var _cursos_decorators;
    var _cursos_initializers = [];
    var _cursos_extraInitializers = [];
    var _entregas_decorators;
    var _entregas_initializers = [];
    var _entregas_extraInitializers = [];
    var Usuario = _classThis = /** @class */ (function (_super) {
        __extends(Usuario_1, _super);
        function Usuario_1() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.username = __runInitializers(_this, _username_initializers, void 0);
            _this.email = (__runInitializers(_this, _username_extraInitializers), __runInitializers(_this, _email_initializers, void 0));
            _this.role = (__runInitializers(_this, _email_extraInitializers), __runInitializers(_this, _role_initializers, void 0));
            _this.phone = (__runInitializers(_this, _role_extraInitializers), __runInitializers(_this, _phone_initializers, void 0));
            _this.password = (__runInitializers(_this, _phone_extraInitializers), __runInitializers(_this, _password_initializers, void 0));
            _this.cursos = (__runInitializers(_this, _password_extraInitializers), __runInitializers(_this, _cursos_initializers, void 0));
            _this.entregas = (__runInitializers(_this, _cursos_extraInitializers), __runInitializers(_this, _entregas_initializers, void 0));
            __runInitializers(_this, _entregas_extraInitializers);
            return _this;
        }
        return Usuario_1;
    }(_classSuper));
    __setFunctionName(_classThis, "Usuario");
    (function () {
        var _a;
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _username_decorators = [(0, mongoose_1.Prop)()];
        _email_decorators = [(0, mongoose_1.Prop)({ unique: [true, 'Email already exists'] })];
        _role_decorators = [(0, mongoose_1.Prop)({ default: 'guest' })];
        _phone_decorators = [(0, mongoose_1.Prop)()];
        _password_decorators = [(0, mongoose_1.Prop)()];
        _cursos_decorators = [(0, mongoose_1.Prop)([{ type: mongoose_2.default.Schema.Types.ObjectId, ref: 'Curso' }])];
        _entregas_decorators = [(0, mongoose_1.Prop)([{ type: mongoose_2.default.Schema.Types.ObjectId, ref: 'Entrega' }])];
        __esDecorate(null, null, _username_decorators, { kind: "field", name: "username", static: false, private: false, access: { has: function (obj) { return "username" in obj; }, get: function (obj) { return obj.username; }, set: function (obj, value) { obj.username = value; } }, metadata: _metadata }, _username_initializers, _username_extraInitializers);
        __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: function (obj) { return "email" in obj; }, get: function (obj) { return obj.email; }, set: function (obj, value) { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
        __esDecorate(null, null, _role_decorators, { kind: "field", name: "role", static: false, private: false, access: { has: function (obj) { return "role" in obj; }, get: function (obj) { return obj.role; }, set: function (obj, value) { obj.role = value; } }, metadata: _metadata }, _role_initializers, _role_extraInitializers);
        __esDecorate(null, null, _phone_decorators, { kind: "field", name: "phone", static: false, private: false, access: { has: function (obj) { return "phone" in obj; }, get: function (obj) { return obj.phone; }, set: function (obj, value) { obj.phone = value; } }, metadata: _metadata }, _phone_initializers, _phone_extraInitializers);
        __esDecorate(null, null, _password_decorators, { kind: "field", name: "password", static: false, private: false, access: { has: function (obj) { return "password" in obj; }, get: function (obj) { return obj.password; }, set: function (obj, value) { obj.password = value; } }, metadata: _metadata }, _password_initializers, _password_extraInitializers);
        __esDecorate(null, null, _cursos_decorators, { kind: "field", name: "cursos", static: false, private: false, access: { has: function (obj) { return "cursos" in obj; }, get: function (obj) { return obj.cursos; }, set: function (obj, value) { obj.cursos = value; } }, metadata: _metadata }, _cursos_initializers, _cursos_extraInitializers);
        __esDecorate(null, null, _entregas_decorators, { kind: "field", name: "entregas", static: false, private: false, access: { has: function (obj) { return "entregas" in obj; }, get: function (obj) { return obj.entregas; }, set: function (obj, value) { obj.entregas = value; } }, metadata: _metadata }, _entregas_initializers, _entregas_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Usuario = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Usuario = _classThis;
}();
exports.Usuario = Usuario;
exports.UsuarioSchema = mongoose_1.SchemaFactory.createForClass(Usuario);
