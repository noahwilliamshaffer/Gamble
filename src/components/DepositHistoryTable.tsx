'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, ExternalLink, Copy, Check } from 'lucide-react';
import { DepositHistory } from '@/lib/userUtils';
import { toast } from 'sonner';

interface DepositHistoryTableProps {
  deposits: DepositHistory[];
}

type SortField = 'timestamp' | 'amount' | 'currency' | 'status';
type SortOrder = 'asc' | 'desc';

export default function DepositHistoryTable({ deposits }: DepositHistoryTableProps) {
  const [sortField, setSortField] = useState<SortField>('timestamp');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [copiedTxHash, setCopiedTxHash] = useState<string | null>(null);

  const sortedDeposits = useMemo(() => {
    return [...deposits].sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortField) {
        case 'timestamp':
          aValue = a.timestamp.toDate().getTime();
          bValue = b.timestamp.toDate().getTime();
          break;
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'currency':
          aValue = a.currency;
          bValue = b.currency;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [deposits, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const copyTxHash = async (txHash: string) => {
    try {
      await navigator.clipboard.writeText(txHash);
      setCopiedTxHash(txHash);
      toast.success('Transaction hash copied to clipboard!');
      setTimeout(() => setCopiedTxHash(null), 3000);
    } catch (error) {
      toast.error('Failed to copy transaction hash');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'pending':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'failed':
        return 'text-red-400 bg-red-500/10 border-red-500/20';
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return '✅';
      case 'pending':
        return '⏳';
      case 'failed':
        return '❌';
      default:
        return '❓';
    }
  };

  const formatDate = (timestamp: any) => {
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateHash = (hash: string) => {
    return `${hash.slice(0, 8)}...${hash.slice(-8)}`;
  };

  const getExplorerUrl = (currency: string, txHash: string) => {
    switch (currency) {
      case 'BTC':
        return `https://blockchair.com/bitcoin/transaction/${txHash}`;
      case 'ETH':
        return `https://etherscan.io/tx/${txHash}`;
      default:
        return '#';
    }
  };

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      className="h-auto p-0 hover:bg-transparent text-left justify-start font-medium text-gray-300 hover:text-white"
      onClick={() => handleSort(field)}
    >
      <span className="flex items-center space-x-1">
        <span>{children}</span>
        {sortField === field && (
          sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
        )}
      </span>
    </Button>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
    >
      <Card className="bg-gray-900/90 border-gray-800 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              📊
            </div>
            <span>Deposit History</span>
          </CardTitle>
          <CardDescription className="text-gray-400">
            Track your cryptocurrency deposits and their confirmation status
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {deposits.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="text-lg font-medium text-gray-300 mb-2">No deposits yet</h3>
              <p className="text-gray-500">Your deposit history will appear here once you make your first deposit.</p>
            </motion.div>
          ) : (
            <div className="rounded-lg border border-gray-800 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-800 hover:bg-gray-800/50">
                    <TableHead className="text-gray-400">
                      <SortButton field="timestamp">Date</SortButton>
                    </TableHead>
                    <TableHead className="text-gray-400">
                      <SortButton field="currency">Currency</SortButton>
                    </TableHead>
                    <TableHead className="text-gray-400 text-right">
                      <SortButton field="amount">Amount</SortButton>
                    </TableHead>
                    <TableHead className="text-gray-400">
                      <SortButton field="status">Status</SortButton>
                    </TableHead>
                    <TableHead className="text-gray-400">Transaction</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedDeposits.map((deposit, index) => (
                    <motion.tr
                      key={deposit.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      className="border-gray-800 hover:bg-gray-800/30 transition-colors"
                    >
                      <TableCell className="text-gray-300">
                        {formatDate(deposit.timestamp)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            deposit.currency === 'BTC' 
                              ? 'bg-gradient-to-r from-orange-400 to-yellow-500 text-black' 
                              : 'bg-gradient-to-r from-blue-400 to-purple-500 text-white'
                          }`}>
                            {deposit.currency === 'BTC' ? '₿' : 'Ξ'}
                          </div>
                          <span className="text-white font-medium">{deposit.currency}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-white font-mono font-medium">
                          {deposit.amount.toFixed(deposit.currency === 'BTC' ? 8 : 6)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(deposit.status)}`}>
                          <span>{getStatusIcon(deposit.status)}</span>
                          <span className="capitalize">{deposit.status}</span>
                        </span>
                      </TableCell>
                      <TableCell>
                        {deposit.txHash ? (
                          <div className="flex items-center space-x-2">
                            <code className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-300 font-mono">
                              {truncateHash(deposit.txHash)}
                            </code>
                            <div className="flex space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 hover:bg-gray-700"
                                onClick={() => copyTxHash(deposit.txHash!)}
                              >
                                {copiedTxHash === deposit.txHash ? (
                                  <Check className="w-3 h-3 text-green-400" />
                                ) : (
                                  <Copy className="w-3 h-3 text-gray-400" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 hover:bg-gray-700"
                                onClick={() => window.open(getExplorerUrl(deposit.currency, deposit.txHash!), '_blank')}
                              >
                                <ExternalLink className="w-3 h-3 text-gray-400" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-500 text-xs">Pending...</span>
                        )}
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
} 