'use client'
import Image from 'next/image'
import {useState, useEffect} from 'react'
import { firestore } from '@/firebase'
import {Box, Stack, Typography, Modal, TextField, Button} from '@mui/material'
import { collection, deleteDoc, getDocs, query, setDoc, doc, getDoc} from 'firebase/firestore'
import SearchIcon from '@mui/icons-material/Search'
import InputAdornment from '@mui/material/InputAdornment';

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [searched, setSearched] = useState('')
  const [filteredInventory, setFilteredInventory] = useState([])

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
    setFilteredInventory(inventoryList)
    console.log(inventoryList)
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()){
      const {quantity} = docSnap.data() 
      await setDoc(docRef, {quantity: quantity + 1})
    } else{
      await setDoc(docRef, {quantity: 1})
    }

    await updateInventory()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()){
      const {quantity} = docSnap.data() 
      if (quantity === 1){
        await deleteDoc(docRef)
      } else{
        await setDoc(docRef, {quantity: quantity - 1})
      }
    }

    await updateInventory()
  }


  useEffect(() => {
    updateInventory()
  }, [])

  useEffect(() => {
    if (searched === ""){
      setFilteredInventory(inventory)
    }else{
      setFilteredInventory(inventory.filter((item) => item.name.toLowerCase().includes(searched.toLowerCase())))
    }
  }, [searched, inventory])


  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Box width='100vw' height='100vh' display='flex' flexDirection='column'  alignItems='center' gap={2} bgcolor='#EADDCA'>
      <Box width='100vw' justifyContent='center' alignContent='center' alignItems='center' position='relative'>
        <Box width='100vw' height='40vh' overflow='hidden' display='flex' flexDirection='column' justifyContent='center' alignItems='center' margin='auto' position='relative'> 
          <img width='100%' src='https://images.unsplash.com/photo-1569717315843-b6a4c2c67ead?q=80&w=3029&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'/>
        </Box>
        <Typography variant='h1' position='absolute' left='50%' top='50%' sx={{transform:"translate(-50%,-50%)"}} bgcolor='#C19A6B'>PantryPal</Typography>
        <Typography variant='h6' position='absolute' left='50%' top='50%' sx={{transform:"translate(-50%,300%)"}} bgcolor='#C19A6B'>Manage your kitchen inventory with this tracker!</Typography>
      </Box>
      <Box display='flex' flexDirection='column'  alignItems='center' gap={2} margin='auto'>
      <Box display='flex' flexDirection='row' position='relative' >
        <Modal open={open} onClose={handleClose}>
          <Box position='absolute' top='50%' left='50%' width={400} bgcolor='white' border='2px solid #000' p={4} display='flex' flexDirection='row' gap={3} sx={{transform:"translate(-50%,-50%)"}}>
            <Typography variant='h6'>Add Item</Typography>
            <Stack width='100%' direction='row' spacing={2}>
              <TextField variant='outlined' fullWidth value={itemName} onChange={(e)=>{setItemName(e.target.value)}}/>
              <Button variant='outlined' onClick={() =>{
                addItem(itemName)
                setItemName('')
                handleClose()}}>Add</Button>
            </Stack>
          </Box>
        </Modal>
      <Button sx={{transform:"translate(50%,0%)"}} variant='contained' onClick={()=>{
        handleOpen()
      }}>Add New Item</Button>
      <TextField position='absolute' top='50%' left='50%' width={400} bgcolor='white' border='2px solid #000'  p={4} display='flex' flexDirection='row' gap={3} sx={{transform:"translate(100%,0%)"}} id="input-with-icon-adornment" label="Search Inventory" variant="standard" InputProps={{endAdornment:(
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
          )}} value={searched} onChange={(e) => 
            {setSearched(e.target.value)
            } }/>
      </Box>
      <Box border={'1px solid #333'}>
        <Box width='800px' height='40px' bgcolor='#ADD8E6'>
          <Typography variant='h4' color='#0096FF' display='flex' alignItems='center' justifyContent='center'>Items</Typography>
        </Box>
      <Stack width='800px' height='180px' spacing={2} overflow='auto' >
        {
          filteredInventory.map(({name, quantity}) => (
            <Box key={name} width='100%' height='30px' display='flex' alignItems='center' justifyContent='space-between' bgcolor='#F0FFFF' padding={3}>
              <Typography variant='h6' color='#0096FF' textAlign='center'>{name.charAt(0).toUpperCase() + name.slice(1)}</Typography>
              <Typography variant='h6' color='#0096FF' textAlign='center'>{quantity}</Typography>
              <Stack direction='row' spacing={2}>
                <Button size='small' variant='contained' onClick={() => addItem(name)}>Add</Button>
                <Button size='small' variant='contained' onClick={() => removeItem(name)}>Remove</Button>
              </Stack>
            </Box>
          ))
        }
      </Stack>
      </Box>
    </Box>
  </Box>
  )
}
