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
exports.ActividadSchema = exports.Actividad = void 0;
//schemas/activity.schema.ts
var mongoose_1 = require("@nestjs/mongoose");
var mongoose_2 = require("mongoose");
var mongoose_3 = require("mongoose");
var Actividad = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({
            timestamps: true
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _classSuper = mongoose_3.Document;
    var _type_decorators;
    var _type_initializers = [];
    var _type_extraInitializers = [];
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _title_decorators;
    var _title_initializers = [];
    var _title_extraInitializers = [];
    var _link_decorators;
    var _link_initializers = [];
    var _link_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _entregas_decorators;
    var _entregas_initializers = [];
    var _entregas_extraInitializers = [];
    var _archivos_decorators;
    var _archivos_initializers = [];
    var _archivos_extraInitializers = [];
    var Actividad = _classThis = /** @class */ (function (_super) {
        __extends(Actividad_1, _super);
        function Actividad_1() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.type = __runInitializers(_this, _type_initializers, void 0);
            _this.name = (__runInitializers(_this, _type_extraInitializers), __runInitializers(_this, _name_initializers, void 0));
            _this.description = (__runInitializers(_this, _name_extraInitializers), __runInitializers(_this, _description_initializers, void 0));
            _this.title = (__runInitializers(_this, _description_extraInitializers), __runInitializers(_this, _title_initializers, void 0));
            _this.link = (__runInitializers(_this, _title_extraInitializers), __runInitializers(_this, _link_initializers, void 0));
            _this.status = (__runInitializers(_this, _link_extraInitializers), __runInitializers(_this, _status_initializers, void 0));
            _this.entregas = (__runInitializers(_this, _status_extraInitializers), __runInitializers(_this, _entregas_initializers, void 0));
            _this.archivos = (__runInitializers(_this, _entregas_extraInitializers), __runInitializers(_this, _archivos_initializers, void 0));
            __runInitializers(_this, _archivos_extraInitializers);
            return _this;
        }
        return Actividad_1;
    }(_classSuper));
    __setFunctionName(_classThis, "Actividad");
    (function () {
        var _a;
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _type_decorators = [(0, mongoose_1.Prop)()];
        _name_decorators = [(0, mongoose_1.Prop)()];
        _description_decorators = [(0, mongoose_1.Prop)()];
        _title_decorators = [(0, mongoose_1.Prop)()];
        _link_decorators = [(0, mongoose_1.Prop)()];
        _status_decorators = [(0, mongoose_1.Prop)()];
        _entregas_decorators = [(0, mongoose_1.Prop)([{ type: mongoose_2.default.Schema.Types.ObjectId, ref: 'Entrega' }])];
        _archivos_decorators = [(0, mongoose_1.Prop)([{ type: mongoose_2.default.Schema.Types.ObjectId, ref: 'Archivo' }])];
        __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: function (obj) { return "type" in obj; }, get: function (obj) { return obj.type; }, set: function (obj, value) { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _link_decorators, { kind: "field", name: "link", static: false, private: false, access: { has: function (obj) { return "link" in obj; }, get: function (obj) { return obj.link; }, set: function (obj, value) { obj.link = value; } }, metadata: _metadata }, _link_initializers, _link_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _entregas_decorators, { kind: "field", name: "entregas", static: false, private: false, access: { has: function (obj) { return "entregas" in obj; }, get: function (obj) { return obj.entregas; }, set: function (obj, value) { obj.entregas = value; } }, metadata: _metadata }, _entregas_initializers, _entregas_extraInitializers);
        __esDecorate(null, null, _archivos_decorators, { kind: "field", name: "archivos", static: false, private: false, access: { has: function (obj) { return "archivos" in obj; }, get: function (obj) { return obj.archivos; }, set: function (obj, value) { obj.archivos = value; } }, metadata: _metadata }, _archivos_initializers, _archivos_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Actividad = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Actividad = _classThis;
}();
exports.Actividad = Actividad;
exports.ActividadSchema = mongoose_1.SchemaFactory.createForClass(Actividad);
