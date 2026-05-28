export function buildRoutePath(path) {
    const routeParametersRegex = /:([a-zA-Z]+)/g
    const paramsWithParams = path.replaceAll(routeParametersRegex, '(?<$1>[a-z0-9\\-_]+)')

    // (?:\?.*)? allows optional query strings: search, filters, orderBy, page, limit
    const pathRegex = new RegExp(`^${paramsWithParams}(?:\\?.*)?$`)

    return pathRegex
}