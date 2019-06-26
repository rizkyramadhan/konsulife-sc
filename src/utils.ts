import query from './libs/gql/data/query';
import createRecord from './libs/gql/data/createRecord';
import updateRecord from './libs/gql/data/updateRecord';

const lpad = (n: string, width: number, z?: string) => {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function romanize(num: number) {
  var lookup: any = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 }, roman = '', i;
  for (i in lookup) {
    while (num >= lookup[i]) {
      roman += i;
      num -= lookup[i];
    }
  }
  return roman;
}

export const getLastNumbering = async (code: string, whouse: string) => {
  const date = new Date();
  const month = (date.getMonth() + 1).toString();
  const year = date.getFullYear().toString();
  const monthRomanize = romanize(parseInt(month));
  let zNumber = "";

  const lastNumber = await query('numbering', ['id', 'last_count'], { where: { name: code, warehouse_id: whouse.toString(), bulan: month, tahun: year } });
  if (lastNumber === undefined) {
    let id = await createRecord('numbering', {
      name: code,
      last_count: 0,
      warehouse_id: whouse,
      bulan: month,
      tahun: year
    })

    zNumber = lpad("1", 4);
    return { id, last_count: 0, format: `${code}/${whouse}/${year}/${monthRomanize}/${zNumber}` }
  }

  zNumber = lpad((lastNumber.last_count + 1), 4);
  return { ...lastNumber, format: `${code}/${whouse}/${year}/${monthRomanize}/${zNumber}` };
}

export const updateLastNumbering = async (id: number, last_count: number) => {
  return await updateRecord('numbering', {
    id: id,
    last_count: last_count
  })
}