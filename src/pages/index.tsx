import { GetServerSideProps } from "next";
import { getMakes, Make } from "../database/getMakes";
import { Formik, Form, Field, useField, useFormikContext } from "formik";
import {
  Paper,
  Grid,
  makeStyles,
  Theme,
  createStyles,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectProps,
  Button,
} from "@material-ui/core";
import Router, { useRouter } from "next/router";
import { Model, getModels } from "../database/getModels";
import { getAsString } from "../getAsString";
import useSWR from "swr";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      margin: "auto",
      maxWidth: 500,
      padding: theme.spacing(3),
    },
  })
);

const prices = [500, 1000, 5000, 15000, 25000, 50000, 250000];
type SearchProps = {
  makes: Make[];
  models: Model[];
  singleColumn?: boolean;
};
export default function Search({ makes, models, singleColumn }: SearchProps) {
  const classes = useStyles();
  const { query } = useRouter();
  const smValue = singleColumn ? 12 : 6;

  const initialValues = {
    make: getAsString(query.make) || "all",
    model: getAsString(query.model) || "all",
    minPrice: getAsString(query.minPrice) || "all",
    maxPrice: getAsString(query.maxPrice) || "all",
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => {
        Router.push({ pathname: "/cars", query: { ...values, page: 1 } });
      }}
    >
      {({ values }) => (
        <Form>
          <Paper elevation={5} className={classes.paper}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={smValue}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel id="search-make">Make</InputLabel>
                  <Field
                    as={Select}
                    labelId="search-make"
                    name="make"
                    label="Make"
                  >
                    <MenuItem value="all">
                      <em>All Makes</em>
                    </MenuItem>
                    {makes.map((make) => (
                      <MenuItem key={make.make} value={make.make}>
                        {`${make.make} (${make.count})`}
                      </MenuItem>
                    ))}
                  </Field>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={smValue}>
                <ModelSelect name="model" models={models} make={values.make} />
              </Grid>
              <Grid item xs={12} sm={smValue}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel id="search-min-price">Min</InputLabel>
                  <Field
                    as={Select}
                    labelId="search-min-price"
                    name="minPrice"
                    label="Min Price"
                  >
                    <MenuItem value="all">
                      <em>No Min</em>
                    </MenuItem>
                    {prices.map((price) => (
                      <MenuItem key={price} value={price}>
                        {price}
                      </MenuItem>
                    ))}
                  </Field>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={smValue}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel id="search-max-price">Max</InputLabel>
                  <Field
                    as={Select}
                    labelId="search-max-price"
                    name="maxPrice"
                    label="Max Price"
                  >
                    <MenuItem value="all">
                      <em>No Max</em>
                    </MenuItem>
                    {prices.map((price) => (
                      <MenuItem key={price} value={price}>
                        {price}
                      </MenuItem>
                    ))}
                  </Field>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  type="submit"
                  fullWidth
                  color="primary"
                >
                  Search
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Form>
      )}
    </Formik>
  );
}

interface ModelSelectProps extends SelectProps {
  name: string;
  models: Model[];
  make: string;
}

export function ModelSelect({ models, make, ...props }: ModelSelectProps) {
  const { setFieldValue } = useFormikContext();
  const [field] = useField({
    name: props.name,
  });

  const { data } = useSWR<Model[]>("/api/models?make=" + make, {
    dedupingInterval: 60000,
    onSuccess: (newValues) => {
      if (!newValues.map((a) => a.model).includes(field.value)) {
        //set value to "all"
        setFieldValue("model", "all");
      }
    },
  });
  const newModels = data || models;

  return (
    <FormControl variant="outlined" fullWidth>
      <InputLabel id="search-model">Model</InputLabel>
      <Select
        labelId="search-model"
        name="model"
        label="Model"
        {...props}
        {...field}
      >
        <MenuItem value="all">
          <em>All Models</em>
        </MenuItem>
        {newModels.map((model) => (
          <MenuItem key={model.model} value={model.model}>
            {`${model.model} (${model.count})`}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const make = getAsString(ctx.query.make);
  // Call getMakes and getModel at the parallel
  const [makes, models] = await Promise.all([getMakes(), getModels(make)]);

  //Old way
  // const makes = await getMakes();
  // const models = await getModels(make);

  return { props: { makes, models } };
};
