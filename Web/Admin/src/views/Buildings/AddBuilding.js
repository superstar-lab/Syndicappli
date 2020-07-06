import React,{useEffect} from 'react';
import {ToastsContainer, ToastsContainerPosition, ToastsStore} from 'react-toasts';
import Grid from '@material-ui/core/Grid';
import MyButton from '../../components/MyButton';
import ScrollBar from 'react-perfect-scrollbar';
import TextField from '@material-ui/core/TextField';
import MySelect from '../../components/MySelect.js';
import {AddBuildingStyles as useStyles} from './useStyles';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import AdminService from '../../services/api.js';

const AddBuilding = (props) => {
  const classes = useStyles();
  let company = [];

  const [companies, setCompanies] = React.useState('');
  const [companyList, setCompanyList] = React.useState([]);
  const [state, setState] = React.useState(false);
  const [name, setName] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [accountHolder, setAccountHolder] = React.useState('');
  const [accountAddress, setAccountAddress] = React.useState('');
  const [accountIban, setAccountIban] = React.useState('');
  const [addClefs, setAddClefs] = React.useState('');
  const [clefList, setClefList] = React.useState([]);
  const [companyID, setCompanyID] = React.useState(-1);

  const [errorsName, setErrorsName] = React.useState('');
  const [errorsAddress, setErrorsAddress] = React.useState('');
  const [errorsCompanies, setErrorsCompanies] = React.useState('');

  const handleChangeCompanies = (val) =>{
    setCompanies(val);
    setCompanyID(companyList[val].companyID);
  };
  const handleChangeName = (event) =>{
    setName(event.target.value);
  };
  const handleChangeAddress = (event) =>{
    setAddress(event.target.value);
  };
  const handleChangeAccountHolder = (event) =>{
    setAccountHolder(event.target.value);
  };
  const handleChangeAccountAddress = (event) =>{
    setAccountAddress(event.target.value);
  };
  const handleChangeAccountIban = (event) =>{
    setAccountIban(event.target.value);
  };
  const handleChangeAddClefs = (event) =>{
    setAddClefs(event.target.value);
  };
  const handleClickAddClef = (event) =>{
      if(addClefs !== ''){
        clefList.push({"name":addClefs});
        setAddClefs('');
        setClefList(clefList);
      }
  };
  const handleClickRemoveClef = (num) =>{
    delete clefList[num];
    clefList.splice(num,1);
    setClefList(clefList);
    setState(!state);
  };

  const handleClose = ()=>{
    props.onCancel();
  };
  const handleClickAdd = ()=>{
      console.log(companies);
    let cnt = 0;
    if(name.length === 0) {setErrorsName('please enter your name'); cnt++;}
    else setErrorsName('');
    if(address.length === 0) {setErrorsAddress('please enter your first name'); cnt++;}
    else setErrorsAddress('');
    if(companyID === -1) {setErrorsCompanies('please select companies'); cnt++;}
    else setErrorsCompanies('');
    if(cnt ===0){
        createBuilding();
    }
  };
  useEffect(()=>{
      getCompanies();
  },[companies]);
  const getCompanies = ()=>{
    AdminService.getCompanyListByUser()
    .then(      
      response => {        
        console.log(response.data);
        // setVisibleIndicator(false);  
        if(response.data.code !== 200){
          console.log('error');
        } else {
          console.log('success');
          const data = response.data.data;
          localStorage.setItem("token", JSON.stringify(data.token));
          data.companylist.map((item)=>(
            company.push(item.name)
          )
          );
           setCompanyList(data.companylist);
           setCompanyID(data.companylist[0].companyID);
        }
      },
      error => {
        console.log('fail');        
        // setVisibleIndicator(false);
      }
    );
  }
  const createBuilding = ()=>{
    const requestData = {
      'companyID': companyID,
      'name' : name,
      'address' : address,
      'vote' : clefList,
      'account_holdername' : accountHolder,
      'account_address' : accountAddress,
      'account_IBAN' : accountIban
    }
    AdminService.createBuilding(requestData)
    .then(      
      response => {        
        console.log(response.data);
        // setVisibleIndicator(false);  
        if(response.data.code !== 200){
            ToastsStore.error(response.data.message);
        } else {
          const data = response.data.data;
          localStorage.setItem("token", JSON.stringify(data.token));
          props.onAdd();
           handleClose();
        }
      },
      error => {
        ToastsStore.error(error);     
        // setVisibleIndicator(false);
      }
    );
  }
  return (
    <div className={classes.root}>
        <div className={classes.paper} >
            <Grid container spacing={4} xs={12}>
                <Grid item container alignItems="center" spacing={2}>
                    <Grid item><p className={classes.title}>Cabinet</p></Grid>
                    <Grid xs item container alignItems="stretch" direction="column">
                        <MySelect 
                            color="gray" 
                            data={company} 
                            onChangeSelect={handleChangeCompanies}
                            value={companies}
                            width="50%"
                        />
                        {errorsCompanies.length > 0 && 
                        <span className={classes.error}>{errorsCompanies}</span>}
                    </Grid>  
                </Grid>
                <Grid item container spacing={2}>
                    <Grid item><p className={classes.title}>Nom</p></Grid>
                    <Grid xs item container alignItems="stretch">
                        <TextField 
                            id="outlined-basic" 
                            rows={3} 
                            multiline 
                            variant="outlined" 
                            value={name}
                            fullWidth
                            onChange={handleChangeName} 
                        />
                        {errorsName.length > 0 && 
                        <span className={classes.error}>{errorsName}</span>}
                    </Grid>
                </Grid>
                <Grid item container spacing={2}>
                    <Grid item><p className={classes.title}>Adresse</p></Grid>
                    <Grid xs item container alignItems="stretch">
                        <TextField 
                            id="outlined-basic" 
                            rows={3} 
                            multiline 
                            variant="outlined" 
                            value={address}
                            fullWidth
                            onChange={handleChangeAddress} 
                        />
                        {errorsAddress.length > 0 && 
                        <span className={classes.error}>{errorsAddress}</span>}
                    </Grid>
                </Grid>
                <Grid item container alignItems="center" spacing={2}>
                    <Grid item><p className={classes.title}>Clefs de répartition</p></Grid>
                </Grid>
                <Grid item container  direction="column" state={state}>
                {
                    clefList.map((clef,i)=>(
                    <Grid container spacing={4}>

                        <Grid xs={6} item container justify="space-between" direction="row-reverse" alignItems="center">
                            <Grid  item>
                                <RemoveCircleOutlineIcon 
                                    className={classes.plus}
                                    onClick={()=>handleClickRemoveClef(i)}
                                />
                            </Grid>
                            <Grid item >
                                <p className={classes.title}>{clef.name}</p>
                            </Grid>
                        </Grid>
                    </Grid>
                    ))
                }
                </Grid>
                <Grid xs={6} item container alignItems="center" justify="space-between" direction="row-reverse">
                    <Grid  item>
                        <AddCircleOutlineIcon 
                            className={classes.plus}
                            onClick={handleClickAddClef}
                        />
                    </Grid>
                    <Grid xs item >
                        <TextField 
                            id="outlined-basic" 
                            variant="outlined" 
                            value={addClefs}
                            onChange={handleChangeAddClefs} 
                            placeholder="Ajouter..."
                        />
                    </Grid>
                </Grid>
                <Grid item container alignItems="center" spacing={2}>
                    <Grid item><p className={classes.title}>Compte Bancaire - Prélèvement SEPA</p></Grid>
                </Grid>
                <Grid item container alignItems="center" spacing={2}>
                    <Grid item><p className={classes.title}>Nom du titulaire du compte</p></Grid>
                    <Grid xs item container alignItems="stretch">
                        <TextField 
                            id="outlined-basic" 
                            variant="outlined" 
                            value={accountHolder}
                            onChange={handleChangeAccountHolder} 
                            fullWidth
                        />
                    </Grid>
                </Grid>
                <Grid item container alignItems="flex-start" spacing={2}>
                    <Grid item><p className={classes.title}>Adresse</p></Grid>
                    <Grid xs item container alignItems="stretch">
                        <TextField 
                            id="outlined-basic" 
                            rows={3} 
                            multiline 
                            variant="outlined" 
                            value={accountAddress}
                            onChange={handleChangeAccountAddress} 
                            fullWidth
                        />
                    </Grid>
                </Grid>
                <Grid item container alignItems="center" spacing={2}>
                    <Grid item><p className={classes.title}>IBAN</p></Grid>
                    <Grid xs item container alignItems="stretch">
                        <TextField 
                            id="outlined-basic" 
                            variant="outlined" 
                            value={accountIban}
                            onChange={handleChangeAccountIban} 
                            fullWidth
                        />
                    </Grid>
                </Grid>
                <Grid xs={12} item container direction="column"  spacing={2}>
                    
                </Grid>
            </Grid>
            <div className={classes.footer}>
                <Grid container justify="space-between">
                    <MyButton name = {"Créer"} color={"1"} onClick={handleClickAdd}/>
                    <MyButton name = {"Annuler"} bgColor="gray" onClick={handleClose}/>  
                </Grid>
            </div>
        </div>
        <ScrollBar/>
        <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_RIGHT}/>
    </div>
  );
};

export default AddBuilding;
