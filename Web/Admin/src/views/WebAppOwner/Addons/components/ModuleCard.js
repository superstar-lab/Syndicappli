import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import {withRouter} from 'react-router-dom';
import MyButton from 'components/MyButton';

const useStyles = makeStyles(theme => ({
  root: {
    [theme.breakpoints.up('xl')]: {
      paddingLeft: theme.spacing(5),
      paddingRight: theme.spacing(4),
    },
    [theme.breakpoints.down('lg')]: {
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(3),
    },
    [theme.breakpoints.down('md')]: {
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(2),
    },
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
    },
  },
  body:{
    [theme.breakpoints.up('xl')]: {
        minHeight: 800,
      marginTop: 64,
      padding: 40,
      borderRadius: 30,
    },
    [theme.breakpoints.down('lg')]: {
        minHeight: 560,
      marginTop: 45,
      padding: 28,
      borderRadius: 21,
    },
    [theme.breakpoints.down('md')]: {
        minHeight: 400,
      marginTop: 32,
      padding: 20,
      borderRadius: 15,
    },
    [theme.breakpoints.down('sm')]: {
        minHeight: 350,
      marginTop: 22,
      padding: 14,
      borderRadius: 11,
    },
    boxShadow: '0 3px 5px 2px rgba(128, 128, 128, .3)',
    justifyContent: 'center',
    display: 'flex'
  },
  size: {
    [theme.breakpoints.up('xl')]: {
      width: 115,
      height: 115,
    },
    [theme.breakpoints.down('lg')]: {
      width: 81,
      height: 81,
    },
    [theme.breakpoints.down('md')]: {
      width: 57,
      height: 57,
    },
    [theme.breakpoints.down('sm')]: {
      width: 40,
      height: 40,
    },
  },
  itemTitle:{
    [theme.breakpoints.up('xl')]: {
      fontSize: 18,
    },
    [theme.breakpoints.down('lg')]: {
      fontSize: 13,
    },
    [theme.breakpoints.down('md')]: {
      fontSize: 9,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 6,
    },
    textAlign: 'center'
  },
  headerTitle:{
      [theme.breakpoints.up('xl')]: {
        fontSize :22
      },
      [theme.breakpoints.down('lg')]: {
        fontSize :15
      },
      [theme.breakpoints.down('md')]: {
        fontSize :11
      },
      [theme.breakpoints.down('sm')]: {
        fontSize :8
      },
      textAlign: 'center'
  },
  price:{
    [theme.breakpoints.up('xl')]: {
      marginTop: 20,
      fontSize :40
    },
    [theme.breakpoints.down('lg')]: {
      marginTop: 14,
      fontSize :28
    },
    [theme.breakpoints.down('md')]: {
      marginTop: 10,
      fontSize :20
    },
    [theme.breakpoints.down('sm')]: {
      marginTop: 7,
      fontSize :14
    },
  },
}));

const ModuleCard = (props) => {
  const {history} = props;
  const classes = useStyles();
  const handleClickBuyModule = ()=>{
    props.onClick();
  }
  return (
    <div className={classes.body}>
        <Grid xs={11} item container direction="column" justify="center" alignItems="center" spacing={4}>
            <Grid item>
                <p className={classes.headerTitle}><b>{props.title}</b></p>
            </Grid>
            <Grid item>
                <img src={props.src} alt="image" className={classes.size}/>
            </Grid>
            <Grid item>
                <p className={classes.itemTitle}>{props.details}</p>
            </Grid>
            <Grid  item container direction="column" alignItems="center" spacing={3}>
              <Grid item ><p className={classes.price}><b>{props.price}</b></p></Grid>
              <Grid item ><MyButton name = {"J'achète le module"} color={"1"} onClick={handleClickBuyModule}/></Grid>
            </Grid>
        </Grid>
    </div>
  );
};

export default withRouter(ModuleCard);
