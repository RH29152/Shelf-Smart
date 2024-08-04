'use client';
import { useState, useEffect } from "react";
import { collection, getDocs, doc, setDoc, deleteDoc, query } from "firebase/firestore";
import { Box, Typography, Stack, TextField, Button, Card, CardContent, CardHeader, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, createTheme, ThemeProvider, Grid, Menu, MenuItem } from "@mui/material";
import { Edit, Delete, AccountCircle } from '@mui/icons-material';
import { firestore, auth } from "@/firebase";
import StorefrontIcon from '@mui/icons-material/Storefront';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useRouter } from 'next/navigation';

// Define custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#000000',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#e5e7eb',
    },
    error: {
      main: '#dc2626',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
          transition: 'background-color 0.3s, color 0.3s',
          '&:hover': {
            backgroundColor: '#333333',
            color: '#ffffff',
          },
          '&:active': {
            backgroundColor: '#555555',
            color: '#ffffff',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
        },
      },
    },
  },
});

const Pantry = () => {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState('');
  const [itemExpiration, setItemExpiration] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState(null);

  const router = useRouter();

  const fetchUserInventory = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    try {
      const userId = currentUser.uid;
      const userInventoryCollection = collection(firestore, `users/${userId}/inventory`);
      const snapshot = await getDocs(query(userInventoryCollection));
      const inventoryList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setInventory(inventoryList);
      setFilteredInventory(inventoryList);
      console.log("Fetched inventory:", inventoryList);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  };

  const addUserItem = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    if (!itemName || !itemQuantity || !itemExpiration) {
      alert("Please fill in all fields before adding an item.");
      return;
    }

    try {
      const userId = currentUser.uid;
      const userInventoryCollection = collection(firestore, `users/${userId}/inventory`);
      const itemDoc = doc(userInventoryCollection);
      await setDoc(itemDoc, {
        name: itemName,
        quantity: Number(itemQuantity),
        expiration: itemExpiration,
      });

      console.log("Item successfully added!");

      resetForm();
      await fetchUserInventory();
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const editUserItem = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser || !editingItem) return;

    try {
      const userId = currentUser.uid;
      const userInventoryCollection = collection(firestore, `users/${userId}/inventory`);
      const itemDoc = doc(userInventoryCollection, editingItem.id);
      await setDoc(itemDoc, {
        name: editingItem.name,
        quantity: Number(itemQuantity),
        expiration: itemExpiration,
      }, { merge: true });

      console.log("Item successfully edited!");

      resetForm();
      await fetchUserInventory();
    } catch (error) {
      console.error("Error editing item:", error);
    }
  };

  const removeUserItem = async (id) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    try {
      const userId = currentUser.uid;
      const userInventoryCollection = collection(firestore, `users/${userId}/inventory`);
      const itemDoc = doc(userInventoryCollection, id);
      await deleteDoc(itemDoc);
      console.log(`Item with id ${id} removed successfully.`);
      await fetchUserInventory();
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const startEditing = (item) => {
    setEditingItem(item);
    setItemName(item.name);
    setItemQuantity(item.quantity);
    setItemExpiration(item.expiration);
  };

  const resetForm = () => {
    setEditingItem(null);
    setItemName('');
    setItemQuantity('');
    setItemExpiration('');
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value === '') {
      setFilteredInventory(inventory);
    } else {
      setFilteredInventory(
        inventory.filter(item => 
          item.name.toLowerCase().includes(e.target.value.toLowerCase())
        )
      );
    }
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      router.push('/Signin');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        fetchUserInventory();
      } else {
        router.push('/Signin');
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Box 
        width="100vw" 
        height="100vh" 
        display="flex" 
        flexDirection="column" 
        sx={{ bgcolor: "#f5f5f5", padding: 0, margin: 0 }}
      >
        {/* Header */}
        <Box 
          width="100%" 
          bgcolor="black" 
          padding={2} 
          boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
          color="white"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box display="flex" alignItems="center">
            <StorefrontIcon sx={{ marginRight: 1, fontSize: '2rem' }} /> {/* Store Icon */}
            <ShoppingCartIcon sx={{ marginRight: 2, fontSize: '2rem' }} /> {/* Shopping Icon */}
            <Typography variant="h4" fontWeight="bold">
              ShelfSmart
            </Typography>
          </Box>
          <Box>
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleProfileMenuOpen}
            >
              <AccountCircle sx={{ fontSize: '2rem' }} />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem disabled>{user?.email}</MenuItem>
              <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* Main Content */}
        <Box 
          flex="1" 
          display="flex" 
          justifyContent="center" 
          alignItems="flex-start" 
          flexDirection="column" 
          gap={4}
          sx={{ padding: 4 }}
        >
          <Grid container spacing={4}>
            {/* Add/Edit Item Form */}
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardHeader title={editingItem ? "Edit Item Details" : "Add New Item"} />
                <CardContent>
                  <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                      label="Name"
                      fullWidth
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      disabled={!!editingItem}
                      InputLabelProps={{
                        shrink: true,
                        style: { fontWeight: 'bold', fontSize: '1rem' },
                      }}
                      sx={{
                        '& .MuiInputBase-root': {
                          padding: '6px 14px',
                          height: '40px',
                        },
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                        },
                      }}
                    />

                    <TextField
                      label="Quantity"
                      type="number"
                      fullWidth
                      value={itemQuantity}
                      onChange={(e) => setItemQuantity(e.target.value)}
                      InputLabelProps={{
                        shrink: true,
                        style: { fontWeight: 'bold', fontSize: '1rem' },
                      }}
                      sx={{
                        '& .MuiInputBase-root': {
                          padding: '6px 14px',
                          height: '40px',
                        },
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                        },
                      }}
                    />

                    <TextField
                      label="Expiration Date"
                      type="date"
                      fullWidth
                      value={itemExpiration}
                      onChange={(e) => setItemExpiration(e.target.value)}
                      InputLabelProps={{
                        shrink: true,
                        style: { fontWeight: 'bold', fontSize: '1rem' },
                      }}
                      sx={{
                        '& .MuiInputBase-root': {
                          padding: '6px 14px',
                          height: '40px',
                        },
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                        },
                        '& input[type="date"]::-webkit-clear-button': {
                          display: 'none',
                        },
                      }}
                    />

                    <Stack direction="row" spacing={2}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={editingItem ? editUserItem : addUserItem}
                      >
                        {editingItem ? 'Save Changes' : 'Add Item'}
                      </Button>
                      {editingItem && (
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={resetForm}
                        >
                          Cancel
                        </Button>
                      )}
                    </Stack>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Inventory Table */}
            <Grid item xs={12} md={8}>
              <Card sx={{ height: '100%', maxHeight: "100%", overflowY: 'auto' }}>
                <CardHeader title="Inventory Items" />
                <CardContent>
                  <TextField
                    label="Search by Name"
                    fullWidth
                    value={searchQuery}
                    onChange={handleSearch}
                    InputLabelProps={{
                      shrink: true,
                      style: { fontWeight: 'bold', fontSize: '1rem', color: '#000' },
                    }}
                    sx={{
                      marginBottom: 2,
                      '& .MuiInputBase-root': {
                        padding: '6px 14px',
                        height: '40px',
                        backgroundColor: '#fff',
                        borderRadius: '8px',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                      },
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        '& fieldset': {
                          borderColor: '#e0e0e0',
                        },
                        '&:hover fieldset': {
                          borderColor: '#bdbdbd',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#000',
                        },
                      },
                    }}
                  />
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>Quantity</TableCell>
                          <TableCell>Expiration</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredInventory.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>{item.expiration}</TableCell>
                            <TableCell>
                              <IconButton 
                                color="primary" 
                                onClick={() => startEditing(item)}
                                sx={{ marginRight: 1 }}
                              >
                                <Edit />
                              </IconButton>
                              <IconButton 
                                color="error" 
                                onClick={() => removeUserItem(item.id)}
                              >
                                <Delete />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Footer */}
        <Box 
          width="100%" 
          height="60px"
          bgcolor="black" 
          padding={2} 
          boxShadow="0 -4px 8px rgba(0, 0, 0, 0.1)"
          color="white"
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ marginTop: "auto" }}
        >
          <Typography variant="body1">
            © {new Date().getFullYear()} ShelfSmart. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default Pantry;
