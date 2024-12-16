/**
 * 
 *  Sample Usage of QuickNode's Solana Priority Fees Add-on
 *  
 *  Description:
 *  This script demonstrates how to use QuickNode's Solana Priority Fees Add-on to estimate the cost of a transaction
 *  and create a dynamic priority fee instruction for a Solana transaction based on your own business logic.
 * 
 *  Resources:
 *  Add-on Page: https://marketplace.quicknode.com/add-on/solana-priority-fee
 *  Guide: https://www.quicknode.com/guides/solana-development/transactions/how-to-use-priority-fees
 *  Documentation: https://quicknode.com/docs/solana/qn_estimatePriorityFees
 *  
 */

import { Transaction, ComputeBudgetProgram } from "@solana/web3.js";
import { RequestPayload, ResponseData, EstimatePriorityFeesParams } from "./types";

async function fetchEstimatePriorityFees({
    last_n_blocks,
    account,
    endpoint
}: EstimatePriorityFeesParams): Promise<ResponseData> {
    const params: any = {};
    if (last_n_blocks !== undefined) {
        params.last_n_blocks = last_n_blocks;
    }
    if (account !== undefined) {
        params.account = account;
    }

    const payload: RequestPayload = {
        method: 'qn_estimatePriorityFees',
        params,
        id: 1,
        jsonrpc: '2.0',
    };

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    console.log(response.json());
    const data: ResponseData = await response.json();
    return data;
}


/**
 * Example of creating a dynamic priority fee instruction for a Solana transaction
 */

const params: EstimatePriorityFeesParams = {
    last_n_blocks: 100,
    account:'GrfytMSKwA1yfjWErCTgxtECfMEU4o9VqPqYRdJER7tD',
    endpoint: 'https://necessary-spring-shard.solana-devnet.quiknode.pro/0417dc7b4af48216baf61e31edbabb9a71579a91/'
};


async function createDynamicPriorityFeeInstruction() {
    const { result } = await fetchEstimatePriorityFees(params);
    console.table(result);
    const priorityFee = result.per_compute_unit.high; // 👈 Replace depending on your transaction requirements (e.g., low, medium, high, or specific percentile)
    const priorityFeeInstruction = ComputeBudgetProgram.setComputeUnitPrice({ microLamports: priorityFee });
    return priorityFeeInstruction;
}

async function main() {
    const priorityFeeInstruction = await createDynamicPriorityFeeInstruction()
    const transaction = new Transaction().add(priorityFeeInstruction);
    // Construct and handle the rest of the transaction
    // ...
}