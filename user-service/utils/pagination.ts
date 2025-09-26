import isEmpty from 'is-empty'

export const pagination = (query: { limit: string; next: string; page: string }) => {
    const page = !isEmpty(query.next) && query.next != '0' ? parseInt(query.next) : parseInt(query.page) || 1
    const limit = parseInt(query.limit) || 10
    const skip = (page - 1) * limit

    return { page, limit, skip }
}
