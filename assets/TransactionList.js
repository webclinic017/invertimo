import React from 'react';
import PropTypes from 'prop-types';

import { ErrorBoundary } from './error_utils.js';
import { TableWithSort } from './components/TableWithSort.js';
import { toSymbol } from './currencies.js';
import Icon from '@material-ui/core/Icon';

import './transaction_list.css';
import Button from '@material-ui/core/Button';

import { makeStyles } from '@material-ui/core/styles';

const embeddedTransactionHeadCells = [
    { id: 'quantity', label: 'Quantity' },
    { id: 'price', label: 'Price' },
    { id: 'local_value', label: 'Total value' },
    { id: 'executed_at', label: 'Executed At' },
    { id: 'transaction_costs', label: 'Fees' },
];


export class EmbeddedTransactionList extends React.Component {

    render() {
        const transactions = this.props.transactions.map(transaction => {
            let transactionCopy = { ...transaction };
            let date = new Date(transactionCopy.executed_at);
            transactionCopy.executed_at = date.toLocaleString();
            return transactionCopy;
        });
        return (
            <ErrorBoundary>
                <TableWithSort rows={transactions} headCells={embeddedTransactionHeadCells} />
            </ErrorBoundary>
        );
    }
}

EmbeddedTransactionList.propTypes = {
    transactions: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        quantity: PropTypes.string.isRequired,
        price: PropTypes.string.isRequired,
        local_value: PropTypes.string.isRequired,
        transaction_costs: PropTypes.string,
        executed_at: PropTypes.string.isRequired,
    })).isRequired,
};

const useStyles = makeStyles({
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    }
});

export function TransactionList(props) {

    const transactionHeadCells = [
        { id: 'position', label: 'Position' },
        { id: 'quantity', label: 'Quantity' },
        { id: 'price', label: 'Price' },
        { id: 'value', label: 'Value' },
        { id: 'transaction_costs', label: 'Fees' },
        { id: 'executed_at', label: 'Executed At' },
        { id: 'interaction', label: '' },
    ];

    let accountsById = new Map(props.accounts.map(account => [account.id, account]));

    if (props.transactions == null) {
        return <div>Loading...</div>;
    }
    const transactions = props.transactions.map(transaction => {
        let transactionCopy = { ...transaction };
        let date = new Date(transactionCopy.executed_at);
        transactionCopy.executed_at = {
            displayValue: date.toLocaleDateString(),
            comparisonKey: date,
        };

        let position = transactionCopy.position;
        let positionField = (
            <div className="position-name">
                <span className="card-label">{position.asset.isin}</span>
                <a href={`#positions/${position.id}`}><span className="position-symbol">{position.asset.symbol}</span></a>
                <span>{position.asset.name}</span>
            </div>
        );
        transactionCopy.position = {
            displayValue: positionField,
            comparisonKey: position.asset.symbol,
        };

        let account = accountsById.get(transaction.position.account);
        const accountCurrencySymbol = toSymbol(account.currency);
        const positionCurrencySymbol = toSymbol(transaction.position.asset.currency);

        transactionCopy.price = {
            displayValue: transactionCopy.price + positionCurrencySymbol,
            comparisonKey: Number(transactionCopy.price),
        };
        transactionCopy.value = {
            displayValue: (<div className="position-name">
                <span>{Number(transactionCopy.value_in_account_currency) + accountCurrencySymbol}</span>
                <span>{Number(transactionCopy.local_value) + positionCurrencySymbol}</span>
            </div>),
            comparisonKey: Number(transactionCopy.value_in_account_currency)
        };
        transactionCopy.transaction_costs = {
            displayValue: transactionCopy.transaction_costs + accountCurrencySymbol,
            comparisonKey: Number(transactionCopy.transaction_costs)
        };

        transactionCopy.interaction = {
            displayValue: <div className="column-stack">
                <Button
                    href={"#/transactions/" + transaction.id}
                >Details</Button>

            </div>
        };
        let lastModifiedDate = new Date(transactionCopy.last_modified);
        transactionCopy.last_modified = lastModifiedDate.toLocaleDateString();
        return transactionCopy;
    });

    const classes = useStyles();

    return (
        <ErrorBoundary>
            <div className={classes.header}>
                <h2>Transactions</h2>
                <Button
                    href="#/transactions/record"
                    variant="contained"
                    color="secondary"
                >
                    <Icon>create</Icon>
                    Record transaction
                </Button>
            </div>
            <TableWithSort
                rows={transactions}
                headCells={transactionHeadCells}
                defaultOrder="desc"
                defaultOrderBy="executed_at" />
        </ErrorBoundary>
    );
}

TransactionList.propTypes = {
    accounts: PropTypes.array.isRequired,
    transactions: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        quantity: PropTypes.string.isRequired,
        price: PropTypes.string.isRequired,
        local_value: PropTypes.string.isRequired,
        transaction_costs: PropTypes.string,
        executed_at: PropTypes.string.isRequired,
    })).isRequired,
};