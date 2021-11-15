import React, { useState } from 'react'
import Header from './Header'
import { useQuery, gql } from '@apollo/client';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { InputBase, InputAdornment, Avatar, Grid, Button, Typography, CircularProgress, Card } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search'
import searchImg from '../images/searchImg.svg'
import noData from '../images/noData.svg'
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    inputRoot: {
      color: theme.palette.type === 'dark' ? '#f1f1f1': 'inherit',
      borderRadius: 10,
      paddingLeft: `calc(1em + ${theme.spacing(2)}px)`,
      backgroundColor: theme.palette.type === 'dark' ? '#424242' : '#eeeeee'
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      height: 40,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: '50ch',
        '&:focus': {
          width: '60ch',
        },
      },
    },
    itemss: {
      padding: 25,
      minWidth: '30%',
      height: '25vh',
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      marginRight: 20,
      marginBottom: 20,
      backgroundColor: theme.palette.type === 'dark' ? '#272727' : '#f1f1f1',
      borderRadius: 10,
      '&:hover': {
        boxShadow: theme.palette.type === 'dark' ? '0px 0px 10px #494949' : '0px 0px 10px #c4c4c4',
        transform: 'translate(0px, -15px)'
      },
      transition: 'transform 0.5s',
    },
    root: {
      backgroundColor: theme.palette.type === 'dark' ? '#111111' : '#fff',
      minHeight: '100vh'
    },
    content: {
      display: 'flex',
      width: '100%',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
    }
  })
)

const SEARCH_USERS = gql`
  query SearchUser($letter: String!) {
    searchUser(letter: $letter) {
      name
      username
      email
      id
    }
  }
`;


const Search: React.FC = () => {
  const classes = useStyles();
  const [ search, setSearch ] = useState('')
  const { loading, error, data} = useQuery(SEARCH_USERS, {
    variables: { letter: search }
  })
  let currentUser = localStorage.getItem("user")

  const changeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  }
  return (
    <div className={classes.root}>
      <Header />
      <div style={{width: "100%", alignItems: 'center', display: 'flex', flexDirection: 'column', marginTop: 100}}>
        <InputBase
          placeholder="Search for the Users…"
          autoFocus
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          }
          onChange={changeSearch}
          inputProps={{ 'aria-label': 'search' }}
        />
      </div>
      
      <br></br>
      <br></br>
      <br></br>
      {loading ? (
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <CircularProgress size="30px" style={{color: '#0277BD'}}  />
        </div>
      ): error ? (
        <>{error.message}</>
      ): search === '' ? (
        <div style={{display: 'flex', height: '68vh', justifyContent: 'center', alignContent: 'center'}}>
          <img src={searchImg} alt="" style={{height: 200, width: 350}} />
        </div>
      ) : data.searchUser.length === 0 ? (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
          <img src={noData} alt="" style={{height: 200, width: 350}} />
          <br></br>
          <br></br>
          <Typography variant="h5" style={{color:"#464646"}}>No results found</Typography>
        </div>
      ) : (
        <Grid container spacing={0}>
          <Grid item xs={2}></Grid>
          <Grid item xs={8} className={classes.content}>
            {data.searchUser.filter((idx: any) => idx.username !== currentUser).map((index: any) => (
              <div key={index.username}>
                <Card variant="outlined" className={classes.itemss}>
                  <Avatar style={{height: 60, width: 60}}>{index.username.charAt(0).toUpperCase()}</Avatar>
                  <span style={{flexGrow: 1}}></span>
                    <Typography variant="h6" color="textPrimary">{index.username}</Typography>
                    <Typography color="textSecondary">{index.name}</Typography>
                  <span style={{flexGrow: 1}}></span>
                  <Link style={{textDecoration: 'none'}} to={`/profile/${index.username}`}>
                    <Button variant="outlined" style={{backgroundColor: '#0277BD', color: '#fff', height: 30, width: 130, textTransform: 'capitalize'}}>
                      View Profile
                    </Button>
                  </Link>
                  {/* </div> */}
                </Card>
              </div>
            ))}
            </Grid>
          <Grid item xs={2}></Grid>
        </Grid>
      )}
    </div>
  )
}

export default Search
