import React from 'react'
import Layout from '../components/Layout'
import Profile from '../components/Profile'
import { Box } from '@mui/material'

const ProfilePage = () => {
  return (
    <Layout>
       <Box sx={{ textAlign: 'center', mt: 4, position: 'relative', minHeight: '100vh' }}>
        <Profile/> 
      </Box>
    </Layout>
  )
}

export default ProfilePage