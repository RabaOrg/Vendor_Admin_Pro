import React from 'react';
import {
  Card, CardContent, Typography, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Collapse, IconButton, CircularProgress, Alert, Box
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { useFetchProductOrder } from '../../../hooks/queries/loan';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import { ExpandMore, ExpandLess } from '@mui/icons-material';

// 1. Define custom theme
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#ff9800' },
    background: { default: '#f4f6f8' },
  },
  spacing: 8,
  typography: {
    fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
    h6: { fontSize: '1.25rem', fontWeight: 600 },
    h4: { fontSize: '2rem', fontWeight: 700 },
    body2: { fontSize: '0.875rem' },
  }
});

export default function PaymentAnalyticsDashboard() {
  const { data: response, isLoading, isError } = useFetchProductOrder();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={10}>
        <CircularProgress size={48} />
      </Box>
    );
  }
  if (isError) {
    return <Alert severity="error">Failed to load analytics.</Alert>;
  }

  const payload = response?.data || {};
  const {
    period = {},
    dashboard = { total: 0, success: 0, failure: 0, success_rate: '0%' },
    transactions = {},
    metrics = {},
    risk_analysis = { users_at_risk: [] }
  } = payload;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Grid container spacing={3} sx={{ p: 3, bgcolor: 'background.default' }}>

        <Grid item xs={12}>
          <Typography variant="subtitle1" color="text.secondary">
            Reporting Period:{' '}
            {period.start ? new Date(period.start).toLocaleDateString() : '—'}
            {' – '}
            {period.end ? new Date(period.end).toLocaleDateString() : '—'}
          </Typography>
        </Grid>


        {[
          ['Total Txns', dashboard.total],
          ['Successful', dashboard.success],
          ['Failed', dashboard.failure],
          ['Success Rate', dashboard.success_rate]
        ].map(([label, val]) => (
          <Grid item xs={12} sm={6} md={3} key={label}>
            <Card elevation={3} sx={{ minHeight: 120, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {label}
                </Typography>
                <Typography variant="h4" color={label === 'Failed' ? 'error' : 'primary'}>
                  {val ?? 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}


        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Transactions Breakdown</Typography>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={[
                  { name: 'Completed', count: transactions.status_completed?.count || 0 },
                  { name: 'Failed', count: transactions.status_failed?.count || 0 }
                ]}
                margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
              >
                <XAxis dataKey="name" tick={{ fontSize: 14 }} />
                <YAxis tick={{ fontSize: 14 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#1976d2" barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        {/* Other Metrics */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Other Metrics</Typography>
            <Grid container spacing={2}>
              {[
                ['Total Transactions', metrics.total_transactions],
                ['Loans w/ Failures', metrics.loans_with_failures],
                ['Users at Risk', metrics.total_users_at_risk],
                ['Outstanding', metrics.total_outstanding_amount]
              ].map(([label, val]) => (
                <Grid item xs={6} key={label}>
                  <Typography variant="body2" color="text.secondary">{label}</Typography>
                  <Typography variant="h6">{val ?? 0}</Typography>
                </Grid>
              ))}
            </Grid>
          </Card>
        </Grid>

        {/* Risk Analysis Table */}
        <Grid item xs={12}>
          <Card elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Risk Analysis</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Failed Loans</TableCell>
                    <TableCell>Outstanding</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(risk_analysis.users_at_risk || []).map((ur, i) => (
                    <RiskRow key={i} userRisk={ur} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

function RiskRow({ userRisk }) {
  const [open, setOpen] = React.useState(false);
  const u = userRisk.user || {};
  return (
    <>
      <TableRow hover>
        <TableCell>{u.name || '—'}</TableCell>
        <TableCell>{u.total_failed_loans ?? 0}</TableCell>
        <TableCell>{u.total_outstanding_amount ?? 0}</TableCell>
        <TableCell align="right">
          <IconButton size="small" onClick={() => setOpen(o => !o)}>
            {open ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={4} sx={{ p: 0 }}>
          <Collapse in={open} timeout="auto">
            <Table size="small" sx={{ bgcolor: 'grey.50' }}>
              <TableHead>
                <TableRow>
                  <TableCell>Loan ID</TableCell>
                  <TableCell>Product</TableCell>
                  <TableCell>Failures</TableCell>
                  <TableCell>Next Bill</TableCell>
                  <TableCell>Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(userRisk.loans || []).map(loan => (
                  <TableRow key={loan.loan_id}>
                    <TableCell>{loan.loan_id}</TableCell>
                    <TableCell>{loan.product?.name || '—'}</TableCell>
                    <TableCell>{loan.failure_count ?? 0}</TableCell>
                    <TableCell>{loan.next_billing_date || '—'}</TableCell>
                    <TableCell>{loan.amount || '0'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
