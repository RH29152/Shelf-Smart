'use client';
import { useState, useEffect } from "react";
import { collection, getDocs, doc, setDoc, deleteDoc, query } from "firebase/firestore";
import { Box, Typography, Stack, TextField, Button, Card, CardContent, CardHeader, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, createTheme, ThemeProvider } from "@mui/material";
import { Edit, Delete } from '@mui/icons-material';
import { firestore } from "@/firebase";
import StorefrontIcon from '@mui/icons-material/Storefront';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

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

export default function Home() {
  const [Inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState('');
  const [itemExpiration, setItemExpiration] = useState('');
  const [editingItem, setEditingItem] = useState(null);

  const fetchInventory = async () => {
    try {
      const snapshot = await getDocs(query(collection(firestore, 'Inventory')));
      const InventoryList = [];
      snapshot.forEach(doc => {
        InventoryList.push({
          id: doc.id,
          name: doc.id,
          ...doc.data(),
        });
      });
      setInventory(InventoryList);
      setFilteredInventory(InventoryList);
      console.log("Fetched inventory:", InventoryList);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  };

  const updateInventory = async () => {
    await fetchInventory();
  };

  const removeItem = async (id) => {
    try {
      const docRef = doc(collection(firestore, 'Inventory'), id);
      await deleteDoc(docRef);
      await updateInventory();
      console.log(`Item with id ${id} removed successfully.`);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const addItem = async () => {
    // Validate input fields
    if (!itemName || !itemQuantity || !itemExpiration) {
      alert("Please fill in all fields before adding an item.");
      return;
    }

    try {
      const docRef = doc(collection(firestore, 'Inventory'), itemName);
      await setDoc(docRef, {
        name: itemName,
        quantity: Number(itemQuantity),
        expiration: itemExpiration
      }, { merge: true });

      console.log("Item successfully added!");

      resetForm();
      await updateInventory();
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const editItem = async () => {
    if (!editingItem) return;

    try {
      const docRef = doc(collection(firestore, 'Inventory'), editingItem.id);
      await setDoc(docRef, {
        name: editingItem.id,
        quantity: Number(itemQuantity),
        expiration: itemExpiration
      }, { merge: true });

      console.log("Item successfully edited!");

      resetForm();
      await updateInventory();
    } catch (error) {
      console.error("Error editing item:", error);
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
      setFilteredInventory(Inventory);
    } else {
      setFilteredInventory(
        Inventory.filter(item => 
          item.name.toLowerCase().includes(e.target.value.toLowerCase())
        )
      );
    }
  };

  useEffect(() => {
    updateInventory();
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
        </Box>

        {/* Main Content */}
        <Box 
          flex="1" 
          display="flex" 
          justifyContent="center" 
          alignItems="flex-start" 
          flexDirection={{ xs: "column", md: "row" }}
          gap={4}
          sx={{ padding: 4 }}
        >
          {/* Add/Edit Item Form */}
          <Card sx={{ flex: 1 }}>
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
                    onClick={editingItem ? editItem : addItem}
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

          {/* Inventory Table */}
          <Card sx={{ flex: 2, maxHeight: 450, overflowY: 'auto' }}>
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
                            onClick={() => removeItem(item.id)}
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
