"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntregasController = void 0;
var common_1 = require("@nestjs/common");
var EntregasController = function () {
    var _classDecorators = [(0, common_1.Controller)('entregas')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _create_decorators;
    var _findAll_decorators;
    var _findOne_decorators;
    var _update_decorators;
    var _remove_decorators;
    var _findEntregaUsuarios_decorators;
    var _findEntregaActividad_decorators;
    var _findEntregaArchivo_decorators;
    var EntregasController = _classThis = /** @class */ (function () {
        function EntregasController_1(entregasService) {
            this.entregasService = (__runInitializers(this, _instanceExtraInitializers), entregasService);
        }
        EntregasController_1.prototype.create = function (createEntregasDto) {
            return this.entregasService.create(createEntregasDto);
        };
        EntregasController_1.prototype.findAll = function () {
            return this.entregasService.findAll();
        };
        EntregasController_1.prototype.findOne = function (id) {
            return this.entregasService.findOne(id);
        };
        EntregasController_1.prototype.update = function (id, updateEntregasDto) {
            return this.entregasService.update(id, updateEntregasDto);
        };
        EntregasController_1.prototype.remove = function (id) {
            return this.entregasService.remove(id);
        };
        EntregasController_1.prototype.findEntregaUsuarios = function (id) {
            return this.entregasService.findEntregaUsuarios(id);
        };
        EntregasController_1.prototype.findEntregaActividad = function (id) {
            return this.entregasService.findEntregaActividad(id);
        };
        EntregasController_1.prototype.findEntregaArchivo = function (id) {
            return this.entregasService.findEntregaArchivo(id);
        };
        return EntregasController_1;
    }());
    __setFunctionName(_classThis, "EntregasController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _create_decorators = [(0, common_1.Post)()];
        _findAll_decorators = [(0, common_1.Get)()];
        _findOne_decorators = [(0, common_1.Get)(':id')];
        _update_decorators = [(0, common_1.Patch)(':id')];
        _remove_decorators = [(0, common_1.Delete)(':id')];
        _findEntregaUsuarios_decorators = [(0, common_1.Get)(':id/usuarios')];
        _findEntregaActividad_decorators = [(0, common_1.Get)(':id/actividades')];
        _findEntregaArchivo_decorators = [(0, common_1.Get)(':id/archivos')];
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: function (obj) { return "create" in obj; }, get: function (obj) { return obj.create; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findAll_decorators, { kind: "method", name: "findAll", static: false, private: false, access: { has: function (obj) { return "findAll" in obj; }, get: function (obj) { return obj.findAll; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findOne_decorators, { kind: "method", name: "findOne", static: false, private: false, access: { has: function (obj) { return "findOne" in obj; }, get: function (obj) { return obj.findOne; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _update_decorators, { kind: "method", name: "update", static: false, private: false, access: { has: function (obj) { return "update" in obj; }, get: function (obj) { return obj.update; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _remove_decorators, { kind: "method", name: "remove", static: false, private: false, access: { has: function (obj) { return "remove" in obj; }, get: function (obj) { return obj.remove; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findEntregaUsuarios_decorators, { kind: "method", name: "findEntregaUsuarios", static: false, private: false, access: { has: function (obj) { return "findEntregaUsuarios" in obj; }, get: function (obj) { return obj.findEntregaUsuarios; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findEntregaActividad_decorators, { kind: "method", name: "findEntregaActividad", static: false, private: false, access: { has: function (obj) { return "findEntregaActividad" in obj; }, get: function (obj) { return obj.findEntregaActividad; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findEntregaArchivo_decorators, { kind: "method", name: "findEntregaArchivo", static: false, private: false, access: { has: function (obj) { return "findEntregaArchivo" in obj; }, get: function (obj) { return obj.findEntregaArchivo; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EntregasController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EntregasController = _classThis;
}();
exports.EntregasController = EntregasController;
