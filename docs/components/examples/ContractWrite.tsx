import * as React from 'react'
import { Button, Stack, Text } from 'degen'
import {
  useAccount,
  useContractWrite,
  useWaitForTransaction,
} from 'wagmi'

import { PreviewWrapper } from '../core'
import { Account, WalletSelector } from '../web3'
import wagmiAbi from './wagmi-abi.json'

export function ContractWrite() {
  const { isConnected } = useAccount()

  const {
    data,
    error,
    isLoading: isWriteLoading,
    isError: isWriteError,
    write,
  } = useContractWrite({
    addressOrName: '0xaf0326d92b97df1221759476b072abfd8084f9be',
    contractInterface: wagmiAbi,
    functionName: 'mint',
  })
  const { isLoading: isConfirming, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })

  if (isConnected)
    return (
      <PreviewWrapper>
        <Stack>
          <Account />
          <Button
            disabled={!write}
            loading={isWriteLoading || isConfirming}
            onClick={() => write?.()}
            width="full"
          >
            {isConfirming ? 'Minting...' : 'Mint'}
          </Button>
          {isWriteError && <Text color="red">Error: {error?.message}</Text>}
          {isSuccess && (
            <Text>
              Success!{' '}
              <a href={`https://etherscan.io/tx/${data?.hash}`}>Etherscan</a>
            </Text>
          )}
        </Stack>
      </PreviewWrapper>
    )

  return (
    <PreviewWrapper>
      <WalletSelector />
    </PreviewWrapper>
  )
}
