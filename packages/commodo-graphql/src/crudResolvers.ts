import { WithFieldsError } from "@webiny/commodo";
import parseBoolean from "./parseBoolean";
import InvalidFieldsError from "./InvalidFieldsError";
import {
    Response,
    ListResponse,
    ErrorResponse,
    NotFoundResponse,
    requiresTotalCount
} from "@webiny/graphql";
import { FieldResolver } from "./types";

type GetModelType = (context: Object) => any; // TODO: add commodo type when available

const notFound = (id?: string) => {
    return new NotFoundResponse(id ? `Record "${id}" not found!` : "Record not found!");
};

export const resolveGet = (getModel: GetModelType): FieldResolver => async (
    root,
    args,
    context
) => {
    const Model: any = getModel(context);

    if (args.id) {
        const model = await Model.findById(args.id);
        if (!model) {
            return notFound(args.id);
        }
        return new Response(model);
    }

    const model = await Model.findOne({ query: args.where, sort: args.sort });

    if (!model) {
        return notFound();
    }
    return new Response(model);
};

export const resolveList = (getModel: GetModelType): FieldResolver => async (
    root,
    args,
    context,
    info
) => {
    const Model: any = getModel(context);

    parseBoolean(args);
    const query = { ...args.where };
    const find: any = {
        query,
        limit: args.limit,
        after: args.after,
        before: args.before,
        sort: args.sort,
        totalCount: requiresTotalCount(info)
    };

    if (args.search && args.search.query) {
        find.search = {
            query: args.search.query,
            fields: args.search.fields,
            operator: args.search.operator || "or"
        };
    }

    const data = await Model.find(find);

    return new ListResponse(data, data.getMeta());
};

export const resolveCreate = (getModel: GetModelType): FieldResolver => async (
    root,
    args,
    context
) => {
    const Model: any = getModel(context);
    const model = new Model();

    try {
        await model.populate(args.data).save();
    } catch (e) {
        if (
            e instanceof WithFieldsError &&
            e.code === WithFieldsError.VALIDATION_FAILED_INVALID_FIELDS
        ) {
            const fieldError = InvalidFieldsError.from(e);
            return new ErrorResponse({
                code: fieldError.code || WithFieldsError.VALIDATION_FAILED_INVALID_FIELDS,
                message: fieldError.message,
                data: fieldError.data
            });
        }
        return new ErrorResponse({
            code: e.code,
            message: e.message,
            data: e.data
        });
    }
    return new Response(model);
};

export const resolveUpdate = (getModel: GetModelType): FieldResolver => async (
    root,
    args,
    context
) => {
    const Model: any = getModel(context);
    const model = await Model.findById(args.id);
    if (!model) {
        return notFound(args.id);
    }

    try {
        await model.populate(args.data);
        await model.save();
    } catch (e) {
        if (
            e instanceof WithFieldsError &&
            e.code === WithFieldsError.VALIDATION_FAILED_INVALID_FIELDS
        ) {
            const fieldError = InvalidFieldsError.from(e);
            return new ErrorResponse({
                code: fieldError.code || WithFieldsError.VALIDATION_FAILED_INVALID_FIELDS,
                message: fieldError.message,
                data: fieldError.data
            });
        }
        return new ErrorResponse({
            code: e.code,
            message: e.message,
            data: e.data || null
        });
    }
    return new Response(model);
};

export const resolveDelete = (getModel: GetModelType): FieldResolver => async (
    root,
    args,
    context
) => {
    const Model = getModel(context);
    const model = await Model.findById(args.id);
    if (!model) {
        return notFound(args.id);
    }

    return model
        .delete()
        .then(() => new Response(true))
        .catch(
            e =>
                new ErrorResponse({
                    code: e.code,
                    message: e.message
                })
        );
};

const resolveMap = {
    get: resolveGet,
    list: resolveList,
    create: resolveCreate,
    update: resolveUpdate,
    delete: resolveDelete
};

export default (modelClass: Function, include: Array<string>) => {
    const resolvers = {};

    include.forEach(name => {
        resolvers[name] = resolveMap[name](modelClass);
    });

    return resolvers;
};
