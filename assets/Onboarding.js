import React from 'react';
import { Stepper } from './components/Stepper.js';
import { CreateAccountForm } from './forms/CreateAccountForm.js';
import { RecordTransactionForm } from './forms/RecordTransactionForm.js';

import makeStyles from '@mui/styles/makeStyles';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import {
    useParams,
} from "react-router-dom";

import PropTypes from 'prop-types';


const useStyles = makeStyles({
    root: {
        minWidth: 275,
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    accountCards: {
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
    }
});


function AccountCard(props) {
    const classes = useStyles();

    return (
        <Card className={classes.root} variant="outlined">
            <CardContent>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                    Account
                </Typography>
                <Typography variant="h5" component="h5">
                    {props.nickname}
                </Typography>
                <Typography className={classes.pos} color="textSecondary">
                    Main currency: {props.currency}
                </Typography>
            </CardContent>

        </Card>
    );
}


AccountCard.propTypes = {
    nickname: PropTypes.string.isRequired,
    currency: PropTypes.string.isRequired,
};


function AddAccountStep({ hasAccounts, handleAddAccount, existingAccounts, defaultCurrency }) {

    const classes = useStyles();

    let intro = null;
    if (hasAccounts) {
        intro = (
            <><h3>Your accounts</h3>
                <div className={classes.accountCards}>
                    {existingAccounts}
                </div>
            </>);
    } else {
        intro = (
            <>
                <h3>You don&apos;t have any account yet...</h3>
                <p>Let&apos;s add one now.</p>

                <p>Account currency is a currency in which all the gains and income will be computed in so chose it carefully. We recommend to pick the currency that you are taxed
                    in and keep the same account currency across all your accounts for simplicity.</p>
            </>
        );
    }
    return <>
        {intro}
        <h3>Create an account 👇</h3>
        <CreateAccountForm
            handleSubmit={handleAddAccount}
            hasAccounts={hasAccounts}
            defaultCurrency={defaultCurrency} />
    </>;

}

AddAccountStep.propTypes = {
    hasAccounts: PropTypes.bool.isRequired,
    existingAccounts: PropTypes.array.isRequired,
    handleAddAccount: PropTypes.func.isRequired,
    defaultCurrency: PropTypes.oneOf(["EUR", "USD", "GBP"]).isRequired,
};


export default function Onboarding(props) {
    let { stepName } = useParams();

    let existingAccounts = props.accounts.map(account => (
        <AccountCard key={account.id} nickname={account.nickname} currency={account.currency} />)
    );

    let numTransactions = "?";
    let hasTransactions = false;
    const hasAccounts = props.accounts.length > 0;
    let defaultCurrency = "EUR";
    if (props.accounts.length > 0) {
        defaultCurrency = props.accounts[props.accounts.length - 1].currency;
    }

    if (props.transactions !== null) {
        numTransactions = props.transactions.length;
        hasTransactions = numTransactions > 0;
    }

    const steps = [
        {
            label: 'Investment accounts',
            path: 'investment_accounts',
            next: 'create_account',
            content: (<div>
                <h3>What are investment accounts?</h3>
                <p>Invertimo helps you track and understand your
                    investments across your various investment accounts,
                    such as brokerages or exchanges.</p>
                <p>To start you need to add at least one investment account
                    and then you will be able to import transactions and associate them with
                    that account.
                </p>
                <p>Account currency is a currency in which all the gains and income will be computed in so chose it carefully. We recommend to pick the currency that you are taxed
                    in and keep the same account currency across all your accounts for simplicity.</p>
                <p>You can later delete or add more investment accounts in the future.</p>
            </div>),
        },
        {
            label: 'Create an account',
            path: 'create_account',
            previous: 'investment_accounts',
            next: 'transactions_intro',
            content: <AddAccountStep
                existingAccounts={existingAccounts} hasAccounts={hasAccounts}
                handleAddAccount={props.handleAddAccount}
                defaultCurrency={defaultCurrency} />,
            nextDisabled: !hasAccounts,
        },
        {
            label: 'Transactions and positions',
            content: (
                <div>
                    <h3>Transactions</h3>
                    <p>When you buy or sell any asset you are making transactions. The same
                        goes to transferring money to or from your investment account.
                        To correctly reflect the state of your account you need to
                        record all the transactions.
                    </p>
                    <h3>Positions</h3>
                    <p>A position is the amount of a security, asset, or property that is owned. The app will automatically create a position if you record a transaction for it.</p>
                    <p>Once you have a position you can track how much of it you own of it over time, your transactions associated with it, gains and dividends.
                        If the position is an asset on a supported exchange, invertimo will automatically pull in a closing price for the last day, so you can track the performance of the position in your portfolio automatically. </p>
                    <p>A position is closed when you sell all of it and there is nothing left.
                        We will still show it in invertimo, because there might be a tax implication.</p>
                </div>

            ),
            path: 'transactions_intro',
            previous: 'create_account',
            next: 'add_transaction',

        },
        {
            label: 'Record some transactions',
            content: (
                <div>
                    <h3>Recording transactions</h3>
                    <p>You currently have {numTransactions} transactions recorded.</p>
                    <h4>Integrations</h4>
                    <p>If you use Degiro, follow <a href="#/transactions/import/degiro">these steps</a>.</p>
                    <p>If you use Binance, follow <a href="#/transactions/import/binance">these steps</a>.</p>
                    <p> We are working on adding more integrations!</p>
                    <h4>Manual recording</h4>
                    <p>You can always record some transactions with
                        a form below.</p>
                    <h3 style={{ marginTop: "2em", marginBottom: "0em" }}>Record a transaction 👇</h3>
                    <RecordTransactionForm
                        accounts={props.accounts}
                        hasTransactions={hasTransactions}
                        handleSubmit={props.handleAddTransaction}
                        defaultAssetOptions={[]} />
                </div>
            ),
            path: 'add_transaction',
            previous: 'transactions_intro',
            nextDisabled: !hasTransactions,
        }
    ];

    let activeStep = 0;
    for (let i = 0; i < steps.length; i++) {
        if (steps[i].path == stepName) {
            activeStep = i;
        }
    }


    return (<div>
        <h2>Welcome to invertimo, let&apos;s get started!</h2>
        <Stepper steps={steps} activeStep={activeStep} baseUrl="#/start/" finishUrl="#" />
    </div>);
}

Onboarding.propTypes = {
    accounts: PropTypes.array.isRequired,
    transactions: PropTypes.array,
    handleAddAccount: PropTypes.func.isRequired,
    handleAddTransaction: PropTypes.func.isRequired,
};