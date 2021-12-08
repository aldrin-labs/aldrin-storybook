export type BorrowLending = {
    'version': '0.0.0',
    'name': 'borrow_lending',
    'instructions': [
        {
            'name': 'initLendingMarket',
            'accounts': [
                {
                    'name': 'owner',
                    'isMut': false,
                    'isSigner': true
                },
                {
                    'name': 'lendingMarket',
                    'isMut': true,
                    'isSigner': false
                },
                {
                    'name': 'oracleProgram',
                    'isMut': false,
                    'isSigner': false
                }
            ],
            'args': [
                {
                    'name': 'currency',
                    'type': {
                        'defined': 'UniversalAssetCurrency'
                    }
                }
            ]
        },
        {
            'name': 'setLendingMarketOwner',
            'accounts': [
                {
                    'name': 'owner',
                    'isMut': false,
                    'isSigner': true
                },
                {
                    'name': 'newOwner',
                    'isMut': false,
                    'isSigner': false
                },
                {
                    'name': 'lendingMarket',
                    'isMut': true,
                    'isSigner': false
                }
            ],
            'args': []
        },
        {
            'name': 'initReserve',
            'accounts': [
                {
                    'name': 'owner',
                    'isMut': false,
                    'isSigner': true
                },
                {
                    'name': 'funder',
                    'isMut': false,
                    'isSigner': true
                },
                {
                    'name': 'lendingMarketPda',
                    'isMut': false,
                    'isSigner': false
                },
                {
                    'name': 'lendingMarket',
                    'isMut': false,
                    'isSigner': false
                },
                {
                    'name': 'reserve',
                    'isMut': true,
                    'isSigner': false
                },
                {
                    'name': 'oracleProduct',
                    'isMut': false,
                    'isSigner': false
                },
                {
                    'name': 'oraclePrice',
                    'isMut': false,
                    'isSigner': false
                },
                {
                    'name': 'sourceLiquidityWallet',
                    'isMut': true,
                    'isSigner': false
                },
                {
                    'name': 'destinationCollateralWallet',
                    'isMut': true,
                    'isSigner': false
                },
                {
                    'name': 'reserveLiquidityWallet',
                    'isMut': true,
                    'isSigner': false
                },
                {
                    'name': 'reserveLiquidityMint',
                    'isMut': false,
                    'isSigner': false
                },
                {
                    'name': 'reserveLiquidityFeeRecvWallet',
                    'isMut': true,
                    'isSigner': false
                },
                {
                    'name': 'reserveCollateralMint',
                    'isMut': true,
                    'isSigner': false
                },
                {
                    'name': 'reserveCollateralWallet',
                    'isMut': true,
                    'isSigner': false
                },
                {
                    'name': 'tokenProgram',
                    'isMut': false,
                    'isSigner': false
                },
                {
                    'name': 'clock',
                    'isMut': false,
                    'isSigner': false
                },
                {
                    'name': 'rent',
                    'isMut': false,
                    'isSigner': false
                }
            ],
            'args': [
                {
                    'name': 'lendingMarketBumpSeed',
                    'type': 'u8'
                },
                {
                    'name': 'liquidityAmount',
                    'type': 'u64'
                },
                {
                    'name': 'config',
                    'type': {
                        'defined': 'InputReserveConfig'
                    }
                }
            ]
        },
        {
            'name': 'refreshReserve',
            'accounts': [
                {
                    'name': 'reserve',
                    'isMut': true,
                    'isSigner': false
                },
                {
                    'name': 'oraclePrice',
                    'isMut': false,
                    'isSigner': false
                },
                {
                    'name': 'clock',
                    'isMut': false,
                    'isSigner': false
                }
            ],
            'args': []
        },
        {
            'name': 'depositReserveLiquidity',
            'accounts': [
                {
                    'name': 'funder',
                    'isMut': false,
                    'isSigner': true
                },
                {
                    'name': 'sourceLiquidityWallet',
                    'isMut': true,
                    'isSigner': false
                },
                {
                    'name': 'lendingMarketPda',
                    'isMut': false,
                    'isSigner': false
                },
                {
                    'name': 'reserve',
                    'isMut': true,
                    'isSigner': false
                },
                {
                    'name': 'reserveCollateralMint',
                    'isMut': true,
                    'isSigner': false
                },
                {
                    'name': 'destinationCollateralWallet',
                    'isMut': true,
                    'isSigner': false
                },
                {
                    'name': 'reserveLiquidityWallet',
                    'isMut': true,
                    'isSigner': false
                },
                {
                    'name': 'tokenProgram',
                    'isMut': false,
                    'isSigner': false
                },
                {
                    'name': 'clock',
                    'isMut': false,
                    'isSigner': false
                }
            ],
            'args': [
                {
                    'name': 'lendingMarketBumpSeed',
                    'type': 'u8'
                },
                {
                    'name': 'liquidityAmount',
                    'type': 'u64'
                }
            ]
        },
        {
            'name': 'redeemReserveCollateral',
            'accounts': [
                {
                    'name': 'funder',
                    'isMut': false,
                    'isSigner': true
                },
                {
                    'name': 'destinationLiquidityWallet',
                    'isMut': true,
                    'isSigner': false
                },
                {
                    'name': 'lendingMarketPda',
                    'isMut': false,
                    'isSigner': false
                },
                {
                    'name': 'reserve',
                    'isMut': true,
                    'isSigner': false
                },
                {
                    'name': 'reserveCollateralMint',
                    'isMut': true,
                    'isSigner': false
                },
                {
                    'name': 'sourceCollateralWallet',
                    'isMut': true,
                    'isSigner': false
                },
                {
                    'name': 'reserveLiquidityWallet',
                    'isMut': true,
                    'isSigner': false
                },
                {
                    'name': 'tokenProgram',
                    'isMut': false,
                    'isSigner': false
                },
                {
                    'name': 'clock',
                    'isMut': false,
                    'isSigner': false
                }
            ],
            'args': [
                {
                    'name': 'lendingMarketBumpSeed',
                    'type': 'u8'
                },
                {
                    'name': 'collateralAmount',
                    'type': 'u64'
                }
            ]
        },
        {
            'name': 'initObligationR10',
            'accounts': [
                {
                    'name': 'owner',
                    'isMut': false,
                    'isSigner': true
                },
                {
                    'name': 'lendingMarket',
                    'isMut': false,
                    'isSigner': false
                },
                {
                    'name': 'obligation',
                    'isMut': true,
                    'isSigner': false
                },
                {
                    'name': 'clock',
                    'isMut': false,
                    'isSigner': false
                }
            ],
            'args': []
        },
        {
            'name': 'refreshObligation',
            'accounts': [
                {
                    'name': 'obligation',
                    'isMut': true,
                    'isSigner': false
                },
                {
                    'name': 'clock',
                    'isMut': false,
                    'isSigner': false
                }
            ],
            'args': []
        },
        {
            'name': 'depositObligationCollateral',
            'accounts': [
                {
                    'name': 'borrower',
                    'isMut': false,
                    'isSigner': true
                },
                {
                    'name': 'obligation',
                    'isMut': true,
                    'isSigner': false
                },
                {
                    'name': 'reserve',
                    'isMut': false,
                    'isSigner': false
                },
                {
                    'name': 'sourceCollateralWallet',
                    'isMut': true,
                    'isSigner': false
                },
                {
                    'name': 'destinationCollateralWallet',
                    'isMut': true,
                    'isSigner': false
                },
                {
                    'name': 'tokenProgram',
                    'isMut': false,
                    'isSigner': false
                },
                {
                    'name': 'clock',
                    'isMut': false,
                    'isSigner': false
                }
            ],
            'args': [
                {
                    'name': 'collateralAmount',
                    'type': 'u64'
                }
            ]
        },
        {
            'name': 'withdrawObligationCollateral',
            'accounts': [
                {
                    'name': 'borrower',
                    'isMut': false,
                    'isSigner': true
                },
                {
                    'name': 'obligation',
                    'isMut': true,
                    'isSigner': false
                },
                {
                    'name': 'reserve',
                    'isMut': false,
                    'isSigner': false
                },
                {
                    'name': 'lendingMarketPda',
                    'isMut': false,
                    'isSigner': false
                },
                {
                    'name': 'sourceCollateralWallet',
                    'isMut': true,
                    'isSigner': false
                },
                {
                    'name': 'destinationCollateralWallet',
                    'isMut': true,
                    'isSigner': false
                },
                {
                    'name': 'tokenProgram',
                    'isMut': false,
                    'isSigner': false
                },
                {
                    'name': 'clock',
                    'isMut': false,
                    'isSigner': false
                }
            ],
            'args': [
                {
                    'name': 'lendingMarketBumpSeed',
                    'type': 'u8'
                },
                {
                    'name': 'collateralAmount',
                    'type': 'u64'
                }
            ]
        },
        {
            'name': 'borrowObligationLiquidity',
            'accounts': [
                {
                    'name': 'borrower',
                    'isMut': false,
                    'isSigner': true
                },
                {
                    'name': 'obligation',
                    'isMut': true,
                    'isSigner': false
                },
                {
                    'name': 'reserve',
                    'isMut': true,
                    'isSigner': false
                },
                {
                    'name': 'lendingMarketPda',
                    'isMut': false,
                    'isSigner': false
                },
                {
                    'name': 'sourceLiquidityWallet',
                    'isMut': true,
                    'isSigner': false
                },
                {
                    'name': 'destinationLiquidityWallet',
                    'isMut': true,
                    'isSigner': false
                },
                {
                    'name': 'feeReceiver',
                    'isMut': true,
                    'isSigner': false
                },
                {
                    'name': 'tokenProgram',
                    'isMut': false,
                    'isSigner': false
                },
                {
                    'name': 'clock',
                    'isMut': false,
                    'isSigner': false
                }
            ],
            'args': [
                {
                    'name': 'lendingMarketBumpSeed',
                    'type': 'u8'
                },
                {
                    'name': 'liquidityAmount',
                    'type': 'u64'
                }
            ]
        },
        {
            'name': 'repayObligationLiquidity',
            'accounts': [
                {
                    'name': 'repayer',
                    'isMut': false,
                    'isSigner': true
                },
                {
                    'name': 'obligation',
                    'isMut': true,
                    'isSigner': false
                },
                {
                    'name': 'reserve',
                    'isMut': true,
                    'isSigner': false
                },
                {
                    'name': 'sourceLiquidityWallet',
                    'isMut': true,
                    'isSigner': false
                },
                {
                    'name': 'destinationLiquidityWallet',
                    'isMut': true,
                    'isSigner': false
                },
                {
                    'name': 'tokenProgram',
                    'isMut': false,
                    'isSigner': false
                },
                {
                    'name': 'clock',
                    'isMut': false,
                    'isSigner': false
                }
            ],
            'args': [
                {
                    'name': 'liquidityAmount',
                    'type': 'u64'
                }
            ]
        },
        {
            'name': 'liquidateObligation',
            'accounts': [
                {
                    'name': 'liquidator',
                    'isMut': false,
                    'isSigner': true
                },
                {
                    'name': 'sourceLiquidityWallet',
                    'isMut': true,
                    'isSigner': false
                },
                {
                    'name': 'destinationCollateralWallet',
                    'isMut': true,
                    'isSigner': false
                },
                {
                    'name': 'obligation',
                    'isMut': true,
                    'isSigner': false
                },
                {
                    'name': 'repayReserve',
                    'isMut': true,
                    'isSigner': false
                },
                {
                    'name': 'reserveLiquidityWallet',
                    'isMut': true,
                    'isSigner': false
                },
                {
                    'name': 'withdrawReserve',
                    'isMut': true,
                    'isSigner': false
                },
                {
                    'name': 'reserveCollateralWallet',
                    'isMut': true,
                    'isSigner': false
                },
                {
                    'name': 'lendingMarketPda',
                    'isMut': false,
                    'isSigner': false
                },
                {
                    'name': 'tokenProgram',
                    'isMut': false,
                    'isSigner': false
                },
                {
                    'name': 'clock',
                    'isMut': false,
                    'isSigner': false
                }
            ],
            'args': [
                {
                    'name': 'lendingMarketBumpSeed',
                    'type': 'u8'
                },
                {
                    'name': 'liquidityAmount',
                    'type': 'u64'
                }
            ]
        }
    ],
    'accounts': [
        {
            'name': 'lendingMarket',
            'type': {
                'kind': 'struct',
                'fields': [
                    {
                        'name': 'owner',
                        'type': 'publicKey'
                    },
                    {
                        'name': 'oracleProgram',
                        'type': 'publicKey'
                    },
                    {
                        'name': 'currency',
                        'type': {
                            'defined': 'UniversalAssetCurrency'
                        }
                    }
                ]
            }
        },
        {
            'name': 'obligation',
            'type': {
                'kind': 'struct',
                'fields': [
                    {
                        'name': 'lastUpdate',
                        'type': {
                            'defined': 'LastUpdate'
                        }
                    },
                    {
                        'name': 'lendingMarket',
                        'type': 'publicKey'
                    },
                    {
                        'name': 'owner',
                        'type': 'publicKey'
                    },
                    {
                        'name': 'reserves',
                        'type': {
                            'array': [
                                {
                                    'defined': 'ObligationReserve'
                                },
                                10
                            ]
                        }
                    },
                    {
                        'name': 'depositedValue',
                        'type': {
                            'defined': 'SDecimal'
                        }
                    },
                    {
                        'name': 'borrowedValue',
                        'type': {
                            'defined': 'SDecimal'
                        }
                    },
                    {
                        'name': 'allowedBorrowValue',
                        'type': {
                            'defined': 'SDecimal'
                        }
                    },
                    {
                        'name': 'unhealthyBorrowValue',
                        'type': {
                            'defined': 'SDecimal'
                        }
                    }
                ]
            }
        },
        {
            'name': 'reserve',
            'type': {
                'kind': 'struct',
                'fields': [
                    {
                        'name': 'lendingMarket',
                        'type': 'publicKey'
                    },
                    {
                        'name': 'lastUpdate',
                        'type': {
                            'defined': 'LastUpdate'
                        }
                    },
                    {
                        'name': 'liquidity',
                        'type': {
                            'defined': 'ReserveLiquidity'
                        }
                    },
                    {
                        'name': 'collateral',
                        'type': {
                            'defined': 'ReserveCollateral'
                        }
                    },
                    {
                        'name': 'config',
                        'type': {
                            'defined': 'ReserveConfig'
                        }
                    }
                ]
            }
        }
    ],
    'types': [
        {
            'name': 'LastUpdate',
            'type': {
                'kind': 'struct',
                'fields': [
                    {
                        'name': 'slot',
                        'type': 'u64'
                    },
                    {
                        'name': 'stale',
                        'type': 'bool'
                    }
                ]
            }
        },
        {
            'name': 'PercentageInt',
            'type': {
                'kind': 'struct',
                'fields': [
                    {
                        'name': 'percent',
                        'type': 'u8'
                    }
                ]
            }
        },
        {
            'name': 'ObligationCollateral',
            'type': {
                'kind': 'struct',
                'fields': [
                    {
                        'name': 'depositReserve',
                        'type': 'publicKey'
                    },
                    {
                        'name': 'depositedAmount',
                        'type': 'u64'
                    },
                    {
                        'name': 'marketValue',
                        'type': {
                            'defined': 'SDecimal'
                        }
                    }
                ]
            }
        },
        {
            'name': 'ObligationLiquidity',
            'type': {
                'kind': 'struct',
                'fields': [
                    {
                        'name': 'borrowReserve',
                        'type': 'publicKey'
                    },
                    {
                        'name': 'cumulativeBorrowRate',
                        'type': {
                            'defined': 'SDecimal'
                        }
                    },
                    {
                        'name': 'borrowedAmount',
                        'type': {
                            'defined': 'SDecimal'
                        }
                    },
                    {
                        'name': 'marketValue',
                        'type': {
                            'defined': 'SDecimal'
                        }
                    }
                ]
            }
        },
        {
            'name': 'ReserveConfig',
            'type': {
                'kind': 'struct',
                'fields': [
                    {
                        'name': 'optimalUtilizationRate',
                        'type': {
                            'defined': 'PercentageInt'
                        }
                    },
                    {
                        'name': 'loanToValueRatio',
                        'type': {
                            'defined': 'PercentageInt'
                        }
                    },
                    {
                        'name': 'liquidationBonus',
                        'type': {
                            'defined': 'PercentageInt'
                        }
                    },
                    {
                        'name': 'liquidationThreshold',
                        'type': {
                            'defined': 'PercentageInt'
                        }
                    },
                    {
                        'name': 'minBorrowRate',
                        'type': {
                            'defined': 'PercentageInt'
                        }
                    },
                    {
                        'name': 'optimalBorrowRate',
                        'type': {
                            'defined': 'PercentageInt'
                        }
                    },
                    {
                        'name': 'maxBorrowRate',
                        'type': {
                            'defined': 'PercentageInt'
                        }
                    },
                    {
                        'name': 'fees',
                        'type': {
                            'defined': 'ReserveFees'
                        }
                    }
                ]
            }
        },
        {
            'name': 'InputReserveConfig',
            'type': {
                'kind': 'struct',
                'fields': [
                    {
                        'name': 'conf',
                        'type': {
                            'defined': 'ReserveConfig'
                        }
                    }
                ]
            }
        },
        {
            'name': 'ReserveFees',
            'type': {
                'kind': 'struct',
                'fields': [
                    {
                        'name': 'borrowFee',
                        'type': {
                            'defined': 'SDecimal'
                        }
                    },
                    {
                        'name': 'flashLoanFee',
                        'type': {
                            'defined': 'SDecimal'
                        }
                    },
                    {
                        'name': 'hostFee',
                        'type': {
                            'defined': 'PercentageInt'
                        }
                    }
                ]
            }
        },
        {
            'name': 'ReserveLiquidity',
            'type': {
                'kind': 'struct',
                'fields': [
                    {
                        'name': 'mint',
                        'type': 'publicKey'
                    },
                    {
                        'name': 'mintDecimals',
                        'type': 'u8'
                    },
                    {
                        'name': 'supply',
                        'type': 'publicKey'
                    },
                    {
                        'name': 'feeReceiver',
                        'type': 'publicKey'
                    },
                    {
                        'name': 'oracle',
                        'type': 'publicKey'
                    },
                    {
                        'name': 'availableAmount',
                        'type': 'u64'
                    },
                    {
                        'name': 'borrowedAmount',
                        'type': {
                            'defined': 'SDecimal'
                        }
                    },
                    {
                        'name': 'cumulativeBorrowRate',
                        'type': {
                            'defined': 'SDecimal'
                        }
                    },
                    {
                        'name': 'marketPrice',
                        'type': {
                            'defined': 'SDecimal'
                        }
                    }
                ]
            }
        },
        {
            'name': 'ReserveCollateral',
            'type': {
                'kind': 'struct',
                'fields': [
                    {
                        'name': 'mint',
                        'type': 'publicKey'
                    },
                    {
                        'name': 'mintTotalSupply',
                        'type': 'u64'
                    },
                    {
                        'name': 'supply',
                        'type': 'publicKey'
                    }
                ]
            }
        },
        {
            'name': 'SDecimal',
            'type': {
                'kind': 'struct',
                'fields': [
                    {
                        'name': 'u192',
                        'type': {
                            'array': [
                                'u64',
                                3
                            ]
                        }
                    }
                ]
            }
        },
        {
            'name': 'UniversalAssetCurrency',
            'type': {
                'kind': 'enum',
                'variants': [
                    {
                        'name': 'Usd'
                    },
                    {
                        'name': 'Pubkey',
                        'fields': [
                            {
                                'name': 'address',
                                'type': 'publicKey'
                            }
                        ]
                    }
                ]
            }
        },
        {
            'name': 'ObligationReserve',
            'type': {
                'kind': 'enum',
                'variants': [
                    {
                        'name': 'Empty'
                    },
                    {
                        'name': 'Collateral',
                        'fields': [
                            {
                                'name': 'inner',
                                'type': {
                                    'defined': 'ObligationCollateral'
                                }
                            }
                        ]
                    },
                    {
                        'name': 'Liquidity',
                        'fields': [
                            {
                                'name': 'inner',
                                'type': {
                                    'defined': 'ObligationLiquidity'
                                }
                            }
                        ]
                    }
                ]
            }
        }
    ],
    'errors': [
        {
            'code': 300,
            'name': 'InvalidMarketOwner',
            'msg': 'Provided owner does not match the market owner'
        },
        {
            'code': 301,
            'name': 'MathOverflow',
            'msg': 'Operation would result in an overflow'
        },
        {
            'code': 302,
            'name': 'InvalidConfig',
            'msg': 'Provided configuration isn\'t in the right format or range'
        },
        {
            'code': 303,
            'name': 'InvalidOracleConfig',
            'msg': 'Provided oracle configuration isn\'t in the right format or range'
        },
        {
            'code': 304,
            'name': 'InvalidOracleDataLayout',
            'msg': 'Cannot read oracle Pyth data because they have an unexpected format'
        },
        {
            'code': 305,
            'name': 'InvalidAmount',
            'msg': 'Provided amount is in invalid range'
        },
        {
            'code': 306,
            'name': 'ReserveStale',
            'msg': 'Reserve account needs to be refreshed'
        },
        {
            'code': 307,
            'name': 'ObligationStale',
            'msg': 'Obligation account needs to be refreshed'
        },
        {
            'code': 308,
            'name': 'MissingReserveAccount',
            'msg': 'A reserve accounts linked to an obligation was not provided'
        },
        {
            'code': 309,
            'name': 'NegativeInterestRate',
            'msg': 'Interest rate cannot be negative'
        },
        {
            'code': 310,
            'name': 'LendingMarketMismatch',
            'msg': 'Provided accounts must belong to the same market'
        },
        {
            'code': 311,
            'name': 'ReserveCollateralDisabled',
            'msg': 'Reserve cannot be used as a collateral'
        },
        {
            'code': 312,
            'name': 'ObligationReserveLimit',
            'msg': 'Number of reserves associated with a single obligation is limited'
        },
        {
            'code': 313,
            'name': 'ObligationCollateralEmpty',
            'msg': 'No collateral deposited in this obligation'
        },
        {
            'code': 314,
            'name': 'ObligationLiquidityEmpty',
            'msg': 'No liquidity borrowed in this obligation'
        },
        {
            'code': 315,
            'name': 'WithdrawTooSmall',
            'msg': 'Cannot withdraw zero collateral'
        },
        {
            'code': 316,
            'name': 'WithdrawTooLarge',
            'msg': 'Cannot withdraw more than allowed amount of collateral'
        },
        {
            'code': 317,
            'name': 'BorrowTooLarge',
            'msg': 'Cannot borrow that amount of liquidity against this obligation'
        },
        {
            'code': 318,
            'name': 'BorrowTooSmall',
            'msg': 'Not enough liquidity borrowed to cover the fees'
        },
        {
            'code': 319,
            'name': 'RepayTooSmall',
            'msg': 'The amount to repay cannot be zero'
        },
        {
            'code': 320,
            'name': 'ObligationHealthy',
            'msg': 'Healthy obligation cannot be liquidated'
        },
        {
            'code': 321,
            'name': 'LiquidationTooSmall',
            'msg': 'To receive some collateral or repay liquidity \\\n        the amount of liquidity to repay must be higher'
        }
    ]
};

export const IDL: BorrowLending = {
    'version': '0.0.0',
    'name': 'borrow_lending',
    'instructions': [
        {
            'name': 'initLendingMarket',
            'accounts': [
                {
                    'name': 'owner',
                    'isMut': false,
                    'isSigner': true,
                },
                {
                    'name': 'lendingMarket',
                    'isMut': true,
                    'isSigner': false,
                },
                {
                    'name': 'oracleProgram',
                    'isMut': false,
                    'isSigner': false,
                },
            ],
            'args': [
                {
                    'name': 'currency',
                    'type': {
                        'defined': 'UniversalAssetCurrency',
                    },
                },
            ],
        },
        {
            'name': 'setLendingMarketOwner',
            'accounts': [
                {
                    'name': 'owner',
                    'isMut': false,
                    'isSigner': true,
                },
                {
                    'name': 'newOwner',
                    'isMut': false,
                    'isSigner': false,
                },
                {
                    'name': 'lendingMarket',
                    'isMut': true,
                    'isSigner': false,
                },
            ],
            'args': [],
        },
        {
            'name': 'initReserve',
            'accounts': [
                {
                    'name': 'owner',
                    'isMut': false,
                    'isSigner': true,
                },
                {
                    'name': 'funder',
                    'isMut': false,
                    'isSigner': true,
                },
                {
                    'name': 'lendingMarketPda',
                    'isMut': false,
                    'isSigner': false,
                },
                {
                    'name': 'lendingMarket',
                    'isMut': false,
                    'isSigner': false,
                },
                {
                    'name': 'reserve',
                    'isMut': true,
                    'isSigner': false,
                },
                {
                    'name': 'oracleProduct',
                    'isMut': false,
                    'isSigner': false,
                },
                {
                    'name': 'oraclePrice',
                    'isMut': false,
                    'isSigner': false,
                },
                {
                    'name': 'sourceLiquidityWallet',
                    'isMut': true,
                    'isSigner': false,
                },
                {
                    'name': 'destinationCollateralWallet',
                    'isMut': true,
                    'isSigner': false,
                },
                {
                    'name': 'reserveLiquidityWallet',
                    'isMut': true,
                    'isSigner': false,
                },
                {
                    'name': 'reserveLiquidityMint',
                    'isMut': false,
                    'isSigner': false,
                },
                {
                    'name': 'reserveLiquidityFeeRecvWallet',
                    'isMut': true,
                    'isSigner': false,
                },
                {
                    'name': 'reserveCollateralMint',
                    'isMut': true,
                    'isSigner': false,
                },
                {
                    'name': 'reserveCollateralWallet',
                    'isMut': true,
                    'isSigner': false,
                },
                {
                    'name': 'tokenProgram',
                    'isMut': false,
                    'isSigner': false,
                },
                {
                    'name': 'clock',
                    'isMut': false,
                    'isSigner': false,
                },
                {
                    'name': 'rent',
                    'isMut': false,
                    'isSigner': false,
                },
            ],
            'args': [
                {
                    'name': 'lendingMarketBumpSeed',
                    'type': 'u8',
                },
                {
                    'name': 'liquidityAmount',
                    'type': 'u64',
                },
                {
                    'name': 'config',
                    'type': {
                        'defined': 'InputReserveConfig',
                    },
                },
            ],
        },
        {
            'name': 'refreshReserve',
            'accounts': [
                {
                    'name': 'reserve',
                    'isMut': true,
                    'isSigner': false,
                },
                {
                    'name': 'oraclePrice',
                    'isMut': false,
                    'isSigner': false,
                },
                {
                    'name': 'clock',
                    'isMut': false,
                    'isSigner': false,
                },
            ],
            'args': [],
        },
        {
            'name': 'depositReserveLiquidity',
            'accounts': [
                {
                    'name': 'funder',
                    'isMut': false,
                    'isSigner': true,
                },
                {
                    'name': 'sourceLiquidityWallet',
                    'isMut': true,
                    'isSigner': false,
                },
                {
                    'name': 'lendingMarketPda',
                    'isMut': false,
                    'isSigner': false,
                },
                {
                    'name': 'reserve',
                    'isMut': true,
                    'isSigner': false,
                },
                {
                    'name': 'reserveCollateralMint',
                    'isMut': true,
                    'isSigner': false,
                },
                {
                    'name': 'destinationCollateralWallet',
                    'isMut': true,
                    'isSigner': false,
                },
                {
                    'name': 'reserveLiquidityWallet',
                    'isMut': true,
                    'isSigner': false,
                },
                {
                    'name': 'tokenProgram',
                    'isMut': false,
                    'isSigner': false,
                },
                {
                    'name': 'clock',
                    'isMut': false,
                    'isSigner': false,
                },
            ],
            'args': [
                {
                    'name': 'lendingMarketBumpSeed',
                    'type': 'u8',
                },
                {
                    'name': 'liquidityAmount',
                    'type': 'u64',
                },
            ],
        },
        {
            'name': 'redeemReserveCollateral',
            'accounts': [
                {
                    'name': 'funder',
                    'isMut': false,
                    'isSigner': true,
                },
                {
                    'name': 'destinationLiquidityWallet',
                    'isMut': true,
                    'isSigner': false,
                },
                {
                    'name': 'lendingMarketPda',
                    'isMut': false,
                    'isSigner': false,
                },
                {
                    'name': 'reserve',
                    'isMut': true,
                    'isSigner': false,
                },
                {
                    'name': 'reserveCollateralMint',
                    'isMut': true,
                    'isSigner': false,
                },
                {
                    'name': 'sourceCollateralWallet',
                    'isMut': true,
                    'isSigner': false,
                },
                {
                    'name': 'reserveLiquidityWallet',
                    'isMut': true,
                    'isSigner': false,
                },
                {
                    'name': 'tokenProgram',
                    'isMut': false,
                    'isSigner': false,
                },
                {
                    'name': 'clock',
                    'isMut': false,
                    'isSigner': false,
                },
            ],
            'args': [
                {
                    'name': 'lendingMarketBumpSeed',
                    'type': 'u8',
                },
                {
                    'name': 'collateralAmount',
                    'type': 'u64',
                },
            ],
        },
        {
            'name': 'initObligationR10',
            'accounts': [
                {
                    'name': 'owner',
                    'isMut': false,
                    'isSigner': true,
                },
                {
                    'name': 'lendingMarket',
                    'isMut': false,
                    'isSigner': false,
                },
                {
                    'name': 'obligation',
                    'isMut': true,
                    'isSigner': false,
                },
                {
                    'name': 'clock',
                    'isMut': false,
                    'isSigner': false,
                },
            ],
            'args': [],
        },
        {
            'name': 'refreshObligation',
            'accounts': [
                {
                    'name': 'obligation',
                    'isMut': true,
                    'isSigner': false,
                },
                {
                    'name': 'clock',
                    'isMut': false,
                    'isSigner': false,
                },
            ],
            'args': [],
        },
        {
            'name': 'depositObligationCollateral',
            'accounts': [
                {
                    'name': 'borrower',
                    'isMut': false,
                    'isSigner': true,
                },
                {
                    'name': 'obligation',
                    'isMut': true,
                    'isSigner': false,
                },
                {
                    'name': 'reserve',
                    'isMut': false,
                    'isSigner': false,
                },
                {
                    'name': 'sourceCollateralWallet',
                    'isMut': true,
                    'isSigner': false,
                },
                {
                    'name': 'destinationCollateralWallet',
                    'isMut': true,
                    'isSigner': false,
                },
                {
                    'name': 'tokenProgram',
                    'isMut': false,
                    'isSigner': false,
                },
                {
                    'name': 'clock',
                    'isMut': false,
                    'isSigner': false,
                },
            ],
            'args': [
                {
                    'name': 'collateralAmount',
                    'type': 'u64',
                },
            ],
        },
        {
            'name': 'withdrawObligationCollateral',
            'accounts': [
                {
                    'name': 'borrower',
                    'isMut': false,
                    'isSigner': true,
                },
                {
                    'name': 'obligation',
                    'isMut': true,
                    'isSigner': false,
                },
                {
                    'name': 'reserve',
                    'isMut': false,
                    'isSigner': false,
                },
                {
                    'name': 'lendingMarketPda',
                    'isMut': false,
                    'isSigner': false,
                },
                {
                    'name': 'sourceCollateralWallet',
                    'isMut': true,
                    'isSigner': false,
                },
                {
                    'name': 'destinationCollateralWallet',
                    'isMut': true,
                    'isSigner': false,
                },
                {
                    'name': 'tokenProgram',
                    'isMut': false,
                    'isSigner': false,
                },
                {
                    'name': 'clock',
                    'isMut': false,
                    'isSigner': false,
                },
            ],
            'args': [
                {
                    'name': 'lendingMarketBumpSeed',
                    'type': 'u8',
                },
                {
                    'name': 'collateralAmount',
                    'type': 'u64',
                },
            ],
        },
        {
            'name': 'borrowObligationLiquidity',
            'accounts': [
                {
                    'name': 'borrower',
                    'isMut': false,
                    'isSigner': true,
                },
                {
                    'name': 'obligation',
                    'isMut': true,
                    'isSigner': false,
                },
                {
                    'name': 'reserve',
                    'isMut': true,
                    'isSigner': false,
                },
                {
                    'name': 'lendingMarketPda',
                    'isMut': false,
                    'isSigner': false,
                },
                {
                    'name': 'sourceLiquidityWallet',
                    'isMut': true,
                    'isSigner': false,
                },
                {
                    'name': 'destinationLiquidityWallet',
                    'isMut': true,
                    'isSigner': false,
                },
                {
                    'name': 'feeReceiver',
                    'isMut': true,
                    'isSigner': false,
                },
                {
                    'name': 'tokenProgram',
                    'isMut': false,
                    'isSigner': false,
                },
                {
                    'name': 'clock',
                    'isMut': false,
                    'isSigner': false,
                },
            ],
            'args': [
                {
                    'name': 'lendingMarketBumpSeed',
                    'type': 'u8',
                },
                {
                    'name': 'liquidityAmount',
                    'type': 'u64',
                },
            ],
        },
        {
            'name': 'repayObligationLiquidity',
            'accounts': [
                {
                    'name': 'repayer',
                    'isMut': false,
                    'isSigner': true,
                },
                {
                    'name': 'obligation',
                    'isMut': true,
                    'isSigner': false,
                },
                {
                    'name': 'reserve',
                    'isMut': true,
                    'isSigner': false,
                },
                {
                    'name': 'sourceLiquidityWallet',
                    'isMut': true,
                    'isSigner': false,
                },
                {
                    'name': 'destinationLiquidityWallet',
                    'isMut': true,
                    'isSigner': false,
                },
                {
                    'name': 'tokenProgram',
                    'isMut': false,
                    'isSigner': false,
                },
                {
                    'name': 'clock',
                    'isMut': false,
                    'isSigner': false,
                },
            ],
            'args': [
                {
                    'name': 'liquidityAmount',
                    'type': 'u64',
                },
            ],
        },
        {
            'name': 'liquidateObligation',
            'accounts': [
                {
                    'name': 'liquidator',
                    'isMut': false,
                    'isSigner': true,
                },
                {
                    'name': 'sourceLiquidityWallet',
                    'isMut': true,
                    'isSigner': false,
                },
                {
                    'name': 'destinationCollateralWallet',
                    'isMut': true,
                    'isSigner': false,
                },
                {
                    'name': 'obligation',
                    'isMut': true,
                    'isSigner': false,
                },
                {
                    'name': 'repayReserve',
                    'isMut': true,
                    'isSigner': false,
                },
                {
                    'name': 'reserveLiquidityWallet',
                    'isMut': true,
                    'isSigner': false,
                },
                {
                    'name': 'withdrawReserve',
                    'isMut': true,
                    'isSigner': false,
                },
                {
                    'name': 'reserveCollateralWallet',
                    'isMut': true,
                    'isSigner': false,
                },
                {
                    'name': 'lendingMarketPda',
                    'isMut': false,
                    'isSigner': false,
                },
                {
                    'name': 'tokenProgram',
                    'isMut': false,
                    'isSigner': false,
                },
                {
                    'name': 'clock',
                    'isMut': false,
                    'isSigner': false,
                },
            ],
            'args': [
                {
                    'name': 'lendingMarketBumpSeed',
                    'type': 'u8',
                },
                {
                    'name': 'liquidityAmount',
                    'type': 'u64',
                },
            ],
        },
    ],
    'accounts': [
        {
            'name': 'lendingMarket',
            'type': {
                'kind': 'struct',
                'fields': [
                    {
                        'name': 'owner',
                        'type': 'publicKey',
                    },
                    {
                        'name': 'oracleProgram',
                        'type': 'publicKey',
                    },
                    {
                        'name': 'currency',
                        'type': {
                            'defined': 'UniversalAssetCurrency',
                        },
                    },
                ],
            },
        },
        {
            'name': 'obligation',
            'type': {
                'kind': 'struct',
                'fields': [
                    {
                        'name': 'lastUpdate',
                        'type': {
                            'defined': 'LastUpdate',
                        },
                    },
                    {
                        'name': 'lendingMarket',
                        'type': 'publicKey',
                    },
                    {
                        'name': 'owner',
                        'type': 'publicKey',
                    },
                    {
                        'name': 'reserves',
                        'type': {
                            'array': [
                                {
                                    'defined': 'ObligationReserve',
                                },
                                10,
                            ],
                        },
                    },
                    {
                        'name': 'depositedValue',
                        'type': {
                            'defined': 'SDecimal',
                        },
                    },
                    {
                        'name': 'borrowedValue',
                        'type': {
                            'defined': 'SDecimal',
                        },
                    },
                    {
                        'name': 'allowedBorrowValue',
                        'type': {
                            'defined': 'SDecimal',
                        },
                    },
                    {
                        'name': 'unhealthyBorrowValue',
                        'type': {
                            'defined': 'SDecimal',
                        },
                    },
                ],
            },
        },
        {
            'name': 'reserve',
            'type': {
                'kind': 'struct',
                'fields': [
                    {
                        'name': 'lendingMarket',
                        'type': 'publicKey',
                    },
                    {
                        'name': 'lastUpdate',
                        'type': {
                            'defined': 'LastUpdate',
                        },
                    },
                    {
                        'name': 'liquidity',
                        'type': {
                            'defined': 'ReserveLiquidity',
                        },
                    },
                    {
                        'name': 'collateral',
                        'type': {
                            'defined': 'ReserveCollateral',
                        },
                    },
                    {
                        'name': 'config',
                        'type': {
                            'defined': 'ReserveConfig',
                        },
                    },
                ],
            },
        },
    ],
    'types': [
        {
            'name': 'LastUpdate',
            'type': {
                'kind': 'struct',
                'fields': [
                    {
                        'name': 'slot',
                        'type': 'u64',
                    },
                    {
                        'name': 'stale',
                        'type': 'bool',
                    },
                ],
            },
        },
        {
            'name': 'PercentageInt',
            'type': {
                'kind': 'struct',
                'fields': [
                    {
                        'name': 'percent',
                        'type': 'u8',
                    },
                ],
            },
        },
        {
            'name': 'ObligationCollateral',
            'type': {
                'kind': 'struct',
                'fields': [
                    {
                        'name': 'depositReserve',
                        'type': 'publicKey',
                    },
                    {
                        'name': 'depositedAmount',
                        'type': 'u64',
                    },
                    {
                        'name': 'marketValue',
                        'type': {
                            'defined': 'SDecimal',
                        },
                    },
                ],
            },
        },
        {
            'name': 'ObligationLiquidity',
            'type': {
                'kind': 'struct',
                'fields': [
                    {
                        'name': 'borrowReserve',
                        'type': 'publicKey',
                    },
                    {
                        'name': 'cumulativeBorrowRate',
                        'type': {
                            'defined': 'SDecimal',
                        },
                    },
                    {
                        'name': 'borrowedAmount',
                        'type': {
                            'defined': 'SDecimal',
                        },
                    },
                    {
                        'name': 'marketValue',
                        'type': {
                            'defined': 'SDecimal',
                        },
                    },
                ],
            },
        },
        {
            'name': 'ReserveConfig',
            'type': {
                'kind': 'struct',
                'fields': [
                    {
                        'name': 'optimalUtilizationRate',
                        'type': {
                            'defined': 'PercentageInt',
                        },
                    },
                    {
                        'name': 'loanToValueRatio',
                        'type': {
                            'defined': 'PercentageInt',
                        },
                    },
                    {
                        'name': 'liquidationBonus',
                        'type': {
                            'defined': 'PercentageInt',
                        },
                    },
                    {
                        'name': 'liquidationThreshold',
                        'type': {
                            'defined': 'PercentageInt',
                        },
                    },
                    {
                        'name': 'minBorrowRate',
                        'type': {
                            'defined': 'PercentageInt',
                        },
                    },
                    {
                        'name': 'optimalBorrowRate',
                        'type': {
                            'defined': 'PercentageInt',
                        },
                    },
                    {
                        'name': 'maxBorrowRate',
                        'type': {
                            'defined': 'PercentageInt',
                        },
                    },
                    {
                        'name': 'fees',
                        'type': {
                            'defined': 'ReserveFees',
                        },
                    },
                ],
            },
        },
        {
            'name': 'InputReserveConfig',
            'type': {
                'kind': 'struct',
                'fields': [
                    {
                        'name': 'conf',
                        'type': {
                            'defined': 'ReserveConfig',
                        },
                    },
                ],
            },
        },
        {
            'name': 'ReserveFees',
            'type': {
                'kind': 'struct',
                'fields': [
                    {
                        'name': 'borrowFee',
                        'type': {
                            'defined': 'SDecimal',
                        },
                    },
                    {
                        'name': 'flashLoanFee',
                        'type': {
                            'defined': 'SDecimal',
                        },
                    },
                    {
                        'name': 'hostFee',
                        'type': {
                            'defined': 'PercentageInt',
                        },
                    },
                ],
            },
        },
        {
            'name': 'ReserveLiquidity',
            'type': {
                'kind': 'struct',
                'fields': [
                    {
                        'name': 'mint',
                        'type': 'publicKey',
                    },
                    {
                        'name': 'mintDecimals',
                        'type': 'u8',
                    },
                    {
                        'name': 'supply',
                        'type': 'publicKey',
                    },
                    {
                        'name': 'feeReceiver',
                        'type': 'publicKey',
                    },
                    {
                        'name': 'oracle',
                        'type': 'publicKey',
                    },
                    {
                        'name': 'availableAmount',
                        'type': 'u64',
                    },
                    {
                        'name': 'borrowedAmount',
                        'type': {
                            'defined': 'SDecimal',
                        },
                    },
                    {
                        'name': 'cumulativeBorrowRate',
                        'type': {
                            'defined': 'SDecimal',
                        },
                    },
                    {
                        'name': 'marketPrice',
                        'type': {
                            'defined': 'SDecimal',
                        },
                    },
                ],
            },
        },
        {
            'name': 'ReserveCollateral',
            'type': {
                'kind': 'struct',
                'fields': [
                    {
                        'name': 'mint',
                        'type': 'publicKey',
                    },
                    {
                        'name': 'mintTotalSupply',
                        'type': 'u64',
                    },
                    {
                        'name': 'supply',
                        'type': 'publicKey',
                    },
                ],
            },
        },
        {
            'name': 'SDecimal',
            'type': {
                'kind': 'struct',
                'fields': [
                    {
                        'name': 'u192',
                        'type': {
                            'array': [
                                'u64',
                                3,
                            ],
                        },
                    },
                ],
            },
        },
        {
            'name': 'UniversalAssetCurrency',
            'type': {
                'kind': 'enum',
                'variants': [
                    {
                        'name': 'Usd',
                    },
                    {
                        'name': 'Pubkey',
                        'fields': [
                            {
                                'name': 'address',
                                'type': 'publicKey',
                            },
                        ],
                    },
                ],
            },
        },
        {
            'name': 'ObligationReserve',
            'type': {
                'kind': 'enum',
                'variants': [
                    {
                        'name': 'Empty',
                    },
                    {
                        'name': 'Collateral',
                        'fields': [
                            {
                                'name': 'inner',
                                'type': {
                                    'defined': 'ObligationCollateral',
                                },
                            },
                        ],
                    },
                    {
                        'name': 'Liquidity',
                        'fields': [
                            {
                                'name': 'inner',
                                'type': {
                                    'defined': 'ObligationLiquidity',
                                },
                            },
                        ],
                    },
                ],
            },
        },
    ],
    'errors': [
        {
            'code': 300,
            'name': 'InvalidMarketOwner',
            'msg': 'Provided owner does not match the market owner',
        },
        {
            'code': 301,
            'name': 'MathOverflow',
            'msg': 'Operation would result in an overflow',
        },
        {
            'code': 302,
            'name': 'InvalidConfig',
            'msg': 'Provided configuration isn\'t in the right format or range',
        },
        {
            'code': 303,
            'name': 'InvalidOracleConfig',
            'msg': 'Provided oracle configuration isn\'t in the right format or range',
        },
        {
            'code': 304,
            'name': 'InvalidOracleDataLayout',
            'msg': 'Cannot read oracle Pyth data because they have an unexpected format',
        },
        {
            'code': 305,
            'name': 'InvalidAmount',
            'msg': 'Provided amount is in invalid range',
        },
        {
            'code': 306,
            'name': 'ReserveStale',
            'msg': 'Reserve account needs to be refreshed',
        },
        {
            'code': 307,
            'name': 'ObligationStale',
            'msg': 'Obligation account needs to be refreshed',
        },
        {
            'code': 308,
            'name': 'MissingReserveAccount',
            'msg': 'A reserve accounts linked to an obligation was not provided',
        },
        {
            'code': 309,
            'name': 'NegativeInterestRate',
            'msg': 'Interest rate cannot be negative',
        },
        {
            'code': 310,
            'name': 'LendingMarketMismatch',
            'msg': 'Provided accounts must belong to the same market',
        },
        {
            'code': 311,
            'name': 'ReserveCollateralDisabled',
            'msg': 'Reserve cannot be used as a collateral',
        },
        {
            'code': 312,
            'name': 'ObligationReserveLimit',
            'msg': 'Number of reserves associated with a single obligation is limited',
        },
        {
            'code': 313,
            'name': 'ObligationCollateralEmpty',
            'msg': 'No collateral deposited in this obligation',
        },
        {
            'code': 314,
            'name': 'ObligationLiquidityEmpty',
            'msg': 'No liquidity borrowed in this obligation',
        },
        {
            'code': 315,
            'name': 'WithdrawTooSmall',
            'msg': 'Cannot withdraw zero collateral',
        },
        {
            'code': 316,
            'name': 'WithdrawTooLarge',
            'msg': 'Cannot withdraw more than allowed amount of collateral',
        },
        {
            'code': 317,
            'name': 'BorrowTooLarge',
            'msg': 'Cannot borrow that amount of liquidity against this obligation',
        },
        {
            'code': 318,
            'name': 'BorrowTooSmall',
            'msg': 'Not enough liquidity borrowed to cover the fees',
        },
        {
            'code': 319,
            'name': 'RepayTooSmall',
            'msg': 'The amount to repay cannot be zero',
        },
        {
            'code': 320,
            'name': 'ObligationHealthy',
            'msg': 'Healthy obligation cannot be liquidated',
        },
        {
            'code': 321,
            'name': 'LiquidationTooSmall',
            'msg': 'To receive some collateral or repay liquidity \\\n        the amount of liquidity to repay must be higher',
        },
    ],
};
