import { Button, Input, Stack, Text } from 'degen'
import { parseEther } from 'ethers/lib/utils'
import * as React from 'react'
import { useAccount, useSendTransaction } from 'wagmi'

import { PreviewWrapper } from '../core'
import { Account, WalletSelector } from '../web3'

function useDebounce(value: any, delay: number) {
  const [debouncedValue, setDebouncedValue] = React.useState(value)

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

export function SendTransaction() {
  const { isConnected } = useAccount()

  const [to, setTo] = React.useState('')
  const debouncedTo = useDebounce(to, 500)

  const [value, setValue] = React.useState('')
  const debouncedValue = useDebounce(value, 500)

  const { data, error, isError, isLoading, isSuccess, sendTransaction } =
    useSendTransaction({
      request: {
        to: debouncedTo,
        value: debouncedValue ? parseEther(debouncedValue) : undefined,
      },
    })

  if (isConnected)
    return (
      <PreviewWrapper>
        <Stack>
          <Account />
          <Input
            onChange={(e) => setTo(e.target.value)}
            label="Recipient"
            placeholder="0xA0Cf…251e"
            value={to}
          />
          <Input
            onChange={(e) => setValue(e.target.value)}
            label="Amount (ether)"
            placeholder="0.05"
            type="number"
            value={value}
          />
          <Button
            disabled={!sendTransaction || !to || !value}
            loading={isLoading}
            onClick={() => sendTransaction?.()}
            width="full"
          >
            Send
          </Button>
          {isSuccess && <Text>Success! Hash: {data?.hash}</Text>}
          {isError && <Text color="red">Error: {error?.message}</Text>}
        </Stack>
      </PreviewWrapper>
    )

  return (
    <PreviewWrapper>
      <WalletSelector />
    </PreviewWrapper>
  )
}
