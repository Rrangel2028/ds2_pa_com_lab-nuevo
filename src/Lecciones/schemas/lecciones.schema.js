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
exports.LeccioneSchema = exports.Lecciones = void 0;
//schemas/lecciones.schema.ts
var mongoose_1 = require("@nestjs/mongoose");
var mongoose_2 = require("mongoose");
var mongoose_3 = require("mongoose");
var Lecciones = function () {
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
    var _category_decorators;
    var _category_initializers = [];
    var _category_extraInitializers = [];
    var _Unidades_decorators;
    var _Unidades_initializers = [];
    var _Unidades_extraInitializers = [];
    var _Archivos_decorators;
    var _Archivos_initializers = [];
    var _Archivos_extraInitializers = [];
    var Lecciones = _classThis = /** @class */ (function (_super) {
        __extends(Lecciones_1, _super);
        function Lecciones_1() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.name = __runInitializers(_this, _name_initializers, void 0);
            _this.category = (__runInitializers(_this, _name_extraInitializers), __runInitializers(_this, _category_initializers, void 0));
            _this.Unidades = (__runInitializers(_this, _category_extraInitializers), __runInitializers(_this, _Unidades_initializers, void 0));
            _this.Archivos = (__runInitializers(_this, _Unidades_extraInitializers), __runInitializers(_this, _Archivos_initializers, void 0));
            __runInitializers(_this, _Archivos_extraInitializers);
            return _this;
        }
        return Lecciones_1;
    }(_classSuper));
    __setFunctionName(_classThis, "Lecciones");
    (function () {
        var _a;
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _name_decorators = [(0, mongoose_1.Prop)()];
        _category_decorators = [(0, mongoose_1.Prop)()];
        _Unidades_decorators = [(0, mongoose_1.Prop)([{ type: mongoose_2.default.Schema.Types.ObjectId, ref: 'Unidades' }])];
        _Archivos_decorators = [(0, mongoose_1.Prop)([{ type: mongoose_2.default.Schema.Types.ObjectId, ref: 'Archivo' }])];
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: function (obj) { return "category" in obj; }, get: function (obj) { return obj.category; }, set: function (obj, value) { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
        __esDecorate(null, null, _Unidades_decorators, { kind: "field", name: "Unidades", static: false, private: false, access: { has: function (obj) { return "Unidades" in obj; }, get: function (obj) { return obj.Unidades; }, set: function (obj, value) { obj.Unidades = value; } }, metadata: _metadata }, _Unidades_initializers, _Unidades_extraInitializers);
        __esDecorate(null, null, _Archivos_decorators, { kind: "field", name: "Archivos", static: false, private: false, access: { has: function (obj) { return "Archivos" in obj; }, get: function (obj) { return obj.Archivos; }, set: function (obj, value) { obj.Archivos = value; } }, metadata: _metadata }, _Archivos_initializers, _Archivos_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Lecciones = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Lecciones = _classThis;
}();
exports.Lecciones = Lecciones;
exports.LeccioneSchema = mongoose_1.SchemaFactory.createForClass(Lecciones);
