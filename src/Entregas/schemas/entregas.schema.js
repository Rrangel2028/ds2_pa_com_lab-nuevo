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
exports.EntregaSchema = exports.Entrega = void 0;
//schemas/delivery.schema.ts
var mongoose_1 = require("@nestjs/mongoose");
var mongoose_2 = require("mongoose");
var mongoose_3 = require("mongoose");
var Entrega = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({
            timestamps: true
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _classSuper = mongoose_3.Document;
    var _delivery_date_decorators;
    var _delivery_date_initializers = [];
    var _delivery_date_extraInitializers = [];
    var _hour_decorators;
    var _hour_initializers = [];
    var _hour_extraInitializers = [];
    var _comment_decorators;
    var _comment_initializers = [];
    var _comment_extraInitializers = [];
    var _usuarios_decorators;
    var _usuarios_initializers = [];
    var _usuarios_extraInitializers = [];
    var _actividades_decorators;
    var _actividades_initializers = [];
    var _actividades_extraInitializers = [];
    var _archivos_decorators;
    var _archivos_initializers = [];
    var _archivos_extraInitializers = [];
    var Entrega = _classThis = /** @class */ (function (_super) {
        __extends(Entrega_1, _super);
        function Entrega_1() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.delivery_date = __runInitializers(_this, _delivery_date_initializers, void 0);
            _this.hour = (__runInitializers(_this, _delivery_date_extraInitializers), __runInitializers(_this, _hour_initializers, void 0));
            _this.comment = (__runInitializers(_this, _hour_extraInitializers), __runInitializers(_this, _comment_initializers, void 0));
            _this.usuarios = (__runInitializers(_this, _comment_extraInitializers), __runInitializers(_this, _usuarios_initializers, void 0));
            _this.actividades = (__runInitializers(_this, _usuarios_extraInitializers), __runInitializers(_this, _actividades_initializers, void 0));
            _this.archivos = (__runInitializers(_this, _actividades_extraInitializers), __runInitializers(_this, _archivos_initializers, void 0));
            __runInitializers(_this, _archivos_extraInitializers);
            return _this;
        }
        return Entrega_1;
    }(_classSuper));
    __setFunctionName(_classThis, "Entrega");
    (function () {
        var _a;
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _delivery_date_decorators = [(0, mongoose_1.Prop)()];
        _hour_decorators = [(0, mongoose_1.Prop)()];
        _comment_decorators = [(0, mongoose_1.Prop)()];
        _usuarios_decorators = [(0, mongoose_1.Prop)([{ type: mongoose_2.default.Schema.Types.ObjectId, ref: 'Usuario' }])];
        _actividades_decorators = [(0, mongoose_1.Prop)([{ type: mongoose_2.default.Schema.Types.ObjectId, ref: 'Actividad' }])];
        _archivos_decorators = [(0, mongoose_1.Prop)([{ type: mongoose_2.default.Schema.Types.ObjectId, ref: 'Archivo' }])];
        __esDecorate(null, null, _delivery_date_decorators, { kind: "field", name: "delivery_date", static: false, private: false, access: { has: function (obj) { return "delivery_date" in obj; }, get: function (obj) { return obj.delivery_date; }, set: function (obj, value) { obj.delivery_date = value; } }, metadata: _metadata }, _delivery_date_initializers, _delivery_date_extraInitializers);
        __esDecorate(null, null, _hour_decorators, { kind: "field", name: "hour", static: false, private: false, access: { has: function (obj) { return "hour" in obj; }, get: function (obj) { return obj.hour; }, set: function (obj, value) { obj.hour = value; } }, metadata: _metadata }, _hour_initializers, _hour_extraInitializers);
        __esDecorate(null, null, _comment_decorators, { kind: "field", name: "comment", static: false, private: false, access: { has: function (obj) { return "comment" in obj; }, get: function (obj) { return obj.comment; }, set: function (obj, value) { obj.comment = value; } }, metadata: _metadata }, _comment_initializers, _comment_extraInitializers);
        __esDecorate(null, null, _usuarios_decorators, { kind: "field", name: "usuarios", static: false, private: false, access: { has: function (obj) { return "usuarios" in obj; }, get: function (obj) { return obj.usuarios; }, set: function (obj, value) { obj.usuarios = value; } }, metadata: _metadata }, _usuarios_initializers, _usuarios_extraInitializers);
        __esDecorate(null, null, _actividades_decorators, { kind: "field", name: "actividades", static: false, private: false, access: { has: function (obj) { return "actividades" in obj; }, get: function (obj) { return obj.actividades; }, set: function (obj, value) { obj.actividades = value; } }, metadata: _metadata }, _actividades_initializers, _actividades_extraInitializers);
        __esDecorate(null, null, _archivos_decorators, { kind: "field", name: "archivos", static: false, private: false, access: { has: function (obj) { return "archivos" in obj; }, get: function (obj) { return obj.archivos; }, set: function (obj, value) { obj.archivos = value; } }, metadata: _metadata }, _archivos_initializers, _archivos_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Entrega = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Entrega = _classThis;
}();
exports.Entrega = Entrega;
exports.EntregaSchema = mongoose_1.SchemaFactory.createForClass(Entrega);
