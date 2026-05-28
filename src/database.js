import fs from "node:fs/promises"

export class Database {
  #database = {}

  constructor() {
    fs.readFile("db.json", "utf8")
      .then(data => {
        this.#database = JSON.parse(data);
      })
      .catch(() => {
        this.#persist();
      })
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data);
    } else {
      this.#database[table] = [data];
    }

    this.#persist();
  }

  select(table, { search, filters, orderBy, page, limit } = {}) {
    let data = this.#database[table] ?? [];

    // search: texto livre em qualquer campo string
    if (search) {
      const term = search.toLowerCase();
      data = data.filter(row =>
        Object.values(row).some(val =>
          typeof val === 'string' && val.toLowerCase().includes(term)
        )
      );
    }

    // filters: ex. ?filters=name=Victor — filtragem por campo exato
    if (filters) {
      const [key, val] = filters.split('=');
      data = data.filter(row => String(row[key]).toLowerCase().includes(val.toLowerCase()));
    }

    // orderBy: ex. ?orderBy=name=asc  ou  ?orderBy=name=desc
    if (orderBy) {
      const [field, direction = 'asc'] = orderBy.split('=');
      const desc = direction === 'desc';
      data = [...data].sort((a, b) => {
        const cmp = String(a[field] ?? '').localeCompare(String(b[field] ?? ''));
        return desc ? -cmp : cmp;
      });
    }

    // page + limit: paginação (base 1)
    if (limit) {
      const size   = Number(limit);
      const offset = (Number(page ?? 1) - 1) * size;
      data = data.slice(offset, offset + size);
    }

    return data;
  }

  selectById(table, id) {
    return this.#database[table].find(row => row.id === id) ?? null;
  }

  update(table, id, data) {
    const index = this.#database[table].findIndex(row => row.id === id);

    if (index > -1) {
      this.#database[table][index] = { id, ...data };
    }

    this.#persist();
  }

  delete(table, id) {
    const index = this.#database[table].findIndex(row => row.id === id);

    if (index > -1) {
      this.#database[table].splice(index, 1);
    }

    this.#persist();
  }

  #persist() {
    fs.writeFile('db.json', JSON.stringify(this.#database));
  }
}