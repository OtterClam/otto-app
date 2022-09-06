import camelCase from 'lodash/camelCase'
import type { NextApiRequest, NextApiResponse } from 'next'
import airtable from './_libs/airtable'

const extractFields = (fields: string[], record: { fields?: { [key: string]: unknown } }) =>
  fields.reduce((data, key) => Object.assign(data, { [camelCase(key)]: (record.fields ?? {})[key] }), {})

const validate = (fields: string[], data: { [key: string]: unknown }) =>
  fields.reduce((valid, key) => valid && Boolean(data[camelCase(key)]), true)

const fields = ['Name', 'Type', 'Image', 'Link']

const optionalFiels = ['OpenNewTab']

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { refresh } = req.query
  const limit = req.query.limit ?? 100
  const uri = `/Banner?maxRecords=${limit}&view=Grid%20view`
  let raw: string

  if (refresh) {
    raw = await airtable.updateCache(uri)
  } else {
    raw = await airtable.fetch(uri)
  }

  const data = JSON.parse(raw)

  res
    .status(200)
    .json(
      (data.records ?? [])
        .map((record: any) => extractFields(fields.concat(optionalFiels), record))
        .filter((record: any) => validate(fields, record))
    )
}
