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
exports.ArchivoSchema = exports.Archivo = void 0;
//schemas/folder.schema.ts
var mongoose_1 = require("@nestjs/mongoose");
var mongoose_2 = require("mongoose");
var mongoose_3 = require("mongoose");
var Archivo = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({
            timestamps: true
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _classSuper = mongoose_3.Document;
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _format_decorators;
    var _format_initializers = [];
    var _format_extraInitializers = [];
    var _route_decorators;
    var _route_initializers = [];
    var _route_extraInitializers = [];
    var _size_decorators;
    var _size_initializers = [];
    var _size_extraInitializers = [];
    var _extent_decorators;
    var _extent_initializers = [];
    var _extent_extraInitializers = [];
    var _order_decorators;
    var _order_initializers = [];
    var _order_extraInitializers = [];
    var _type_decorators;
    var _type_initializers = [];
    var _type_extraInitializers = [];
    var _title_decorators;
    var _title_initializers = [];
    var _title_extraInitializers = [];
    var _entregas_decorators;
    var _entregas_initializers = [];
    var _entregas_extraInitializers = [];
    var _actividades_decorators;
    var _actividades_initializers = [];
    var _actividades_extraInitializers = [];
    var _lecciones_decorators;
    var _lecciones_initializers = [];
    var _lecciones_extraInitializers = [];
    var Archivo = _classThis = /** @class */ (function (_super) {
        __extends(Archivo_1, _super);
        function Archivo_1() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.name = __runInitializers(_this, _name_initializers, void 0);
            _this.format = (__runInitializers(_this, _name_extraInitializers), __runInitializers(_this, _format_initializers, void 0));
            _this.route = (__runInitializers(_this, _format_extraInitializers), __runInitializers(_this, _route_initializers, void 0));
            _this.size = (__runInitializers(_this, _route_extraInitializers), __runInitializers(_this, _size_initializers, void 0));
            _this.extent = (__runInitializers(_this, _size_extraInitializers), __runInitializers(_this, _extent_initializers, void 0));
            _this.order = (__runInitializers(_this, _extent_extraInitializers), __runInitializers(_this, _order_initializers, void 0));
            _this.type = (__runInitializers(_this, _order_extraInitializers), __runInitializers(_this, _type_initializers, void 0));
            _this.title = (__runInitializers(_this, _type_extraInitializers), __runInitializers(_this, _title_initializers, void 0));
            _this.entregas = (__runInitializers(_this, _title_extraInitializers), __runInitializers(_this, _entregas_initializers, void 0));
            _this.actividades = (__runInitializers(_this, _entregas_extraInitializers), __runInitializers(_this, _actividades_initializers, void 0));
            _this.lecciones = (__runInitializers(_this, _actividades_extraInitializers), __runInitializers(_this, _lecciones_initializers, void 0));
            __runInitializers(_this, _lecciones_extraInitializers);
            return _this;
        }
        return Archivo_1;
    }(_classSuper));
    __setFunctionName(_classThis, "Archivo");
    (function () {
        var _a;
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _name_decorators = [(0, mongoose_1.Prop)()];
        _format_decorators = [(0, mongoose_1.Prop)()];
        _route_decorators = [(0, mongoose_1.Prop)()];
        _size_decorators = [(0, mongoose_1.Prop)()];
        _extent_decorators = [(0, mongoose_1.Prop)()];
        _order_decorators = [(0, mongoose_1.Prop)()];
        _type_decorators = [(0, mongoose_1.Prop)()];
        _title_decorators = [(0, mongoose_1.Prop)()];
        _entregas_decorators = [(0, mongoose_1.Prop)([{ type: mongoose_2.default.Schema.Types.ObjectId, ref: 'Entrega' }])];
        _actividades_decorators = [(0, mongoose_1.Prop)([{ type: mongoose_2.default.Schema.Types.ObjectId, ref: 'Actividad' }])];
        _lecciones_decorators = [(0, mongoose_1.Prop)([{ type: mongoose_2.default.Schema.Types.ObjectId, ref: 'Lecciones' }])];
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _format_decorators, { kind: "field", name: "format", static: false, private: false, access: { has: function (obj) { return "format" in obj; }, get: function (obj) { return obj.format; }, set: function (obj, value) { obj.format = value; } }, metadata: _metadata }, _format_initializers, _format_extraInitializers);
        __esDecorate(null, null, _route_decorators, { kind: "field", name: "route", static: false, private: false, access: { has: function (obj) { return "route" in obj; }, get: function (obj) { return obj.route; }, set: function (obj, value) { obj.route = value; } }, metadata: _metadata }, _route_initializers, _route_extraInitializers);
        __esDecorate(null, null, _size_decorators, { kind: "field", name: "size", static: false, private: false, access: { has: function (obj) { return "size" in obj; }, get: function (obj) { return obj.size; }, set: function (obj, value) { obj.size = value; } }, metadata: _metadata }, _size_initializers, _size_extraInitializers);
        __esDecorate(null, null, _extent_decorators, { kind: "field", name: "extent", static: false, private: false, access: { has: function (obj) { return "extent" in obj; }, get: function (obj) { return obj.extent; }, set: function (obj, value) { obj.extent = value; } }, metadata: _metadata }, _extent_initializers, _extent_extraInitializers);
        __esDecorate(null, null, _order_decorators, { kind: "field", name: "order", static: false, private: false, access: { has: function (obj) { return "order" in obj; }, get: function (obj) { return obj.order; }, set: function (obj, value) { obj.order = value; } }, metadata: _metadata }, _order_initializers, _order_extraInitializers);
        __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: function (obj) { return "type" in obj; }, get: function (obj) { return obj.type; }, set: function (obj, value) { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _entregas_decorators, { kind: "field", name: "entregas", static: false, private: false, access: { has: function (obj) { return "entregas" in obj; }, get: function (obj) { return obj.entregas; }, set: function (obj, value) { obj.entregas = value; } }, metadata: _metadata }, _entregas_initializers, _entregas_extraInitializers);
        __esDecorate(null, null, _actividades_decorators, { kind: "field", name: "actividades", static: false, private: false, access: { has: function (obj) { return "actividades" in obj; }, get: function (obj) { return obj.actividades; }, set: function (obj, value) { obj.actividades = value; } }, metadata: _metadata }, _actividades_initializers, _actividades_extraInitializers);
        __esDecorate(null, null, _lecciones_decorators, { kind: "field", name: "lecciones", static: false, private: false, access: { has: function (obj) { return "lecciones" in obj; }, get: function (obj) { return obj.lecciones; }, set: function (obj, value) { obj.lecciones = value; } }, metadata: _metadata }, _lecciones_initializers, _lecciones_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Archivo = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Archivo = _classThis;
}();
exports.Archivo = Archivo;
exports.ArchivoSchema = mongoose_1.SchemaFactory.createForClass(Archivo);
