const url: string = "http://mock.rx.plansys.co";

export const search = (
  table: string,
  options: {
    field?: string;
    search?: string;
    returns?: string[];
    except?: string[];
    page?: number;
    limit?: number;
  }
) => {
  console.log(url, table, options);
}