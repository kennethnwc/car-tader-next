import { GetServerSideProps } from "next";
import { openDB } from "../../../../openDB";
import { CarModel } from "../../../../../api/Car";
import {
  makeStyles,
  Theme,
  createStyles,
  Paper,
  Grid,
  ButtonBase,
  Typography,
} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(2),
      margin: "auto",
    },
    img: {
      width: "100%",
    },
  })
);

type Props = {
  car: CarModel | null | undefined;
};

export default function CarDetails({ car }: Props) {
  const classes = useStyles();
  if (!car) {
    return <h1>Car not found</h1>;
  }
  return (
    <Paper className={classes.paper}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={5}>
          <img className={classes.img} alt="complex" src={car.photoUrl} />
        </Grid>
        <Grid item xs={12} sm={6} md={7} container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography gutterBottom variant="h5">
                {car.make + " " + car.model}
              </Typography>
              <Typography gutterBottom variant="h4">
                ${car.price}
              </Typography>
              <Typography gutterBottom variant="body2" color="textSecondary">
                Year: {car.year}
              </Typography>
              <Typography gutterBottom variant="body2" color="textSecondary">
                KMs: {car.kilometers}
              </Typography>
              <Typography gutterBottom variant="body2" color="textSecondary">
                Fuel Type: {car.fuelType}
              </Typography>
              <Typography gutterBottom variant="body1" color="textSecondary">
                Details: {car.details}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const id = ctx.params.id;
  const db = await openDB();
  const car = await db.get<CarModel | undefined>(
    "SELECT * FROM Car where id = ?",
    id
  );
  return { props: { car: car || null } };
};
