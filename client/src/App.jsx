import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { 
  ThemeProvider, 
  CssBaseline, 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  createTheme
} from '@mui/material'
import { Menu as MenuIcon, Inventory as InventoryIcon } from '@mui/icons-material'
import ProductList from './components/ProductList'
import ProductDetails from './components/ProductDetails'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
})

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen)
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex' }}>
          <AppBar position="fixed">
            <Toolbar>
              <IconButton
                color="inherit"
                edge="start"
                onClick={toggleDrawer}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Product Management System
              </Typography>
            </Toolbar>
          </AppBar>

          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={toggleDrawer}
          >
            <Box
              sx={{ width: 250 }}
              role="presentation"
              onClick={toggleDrawer}
            >
              <List>
                <ListItem button component={Link} to="/products">
                  <ListItemIcon>
                    <InventoryIcon />
                  </ListItemIcon>
                  <ListItemText primary="Products" />
                </ListItem>
              </List>
            </Box>
          </Drawer>

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              mt: 8,
              backgroundColor: 'background.default',
              minHeight: '100vh',
            }}
          >
            <Routes>
              <Route path="/" element={<ProductList />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/products/:id" element={<ProductDetails />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  )
}

export default App
