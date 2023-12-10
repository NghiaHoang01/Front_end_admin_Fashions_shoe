import { Popconfirm, Select, Spin, Table } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { LIST_ORDER_STATUS, STATUS_ORDER } from 'constant/Variable'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ConvertDateHaveHour } from 'utils/ConvertDateHaveHour'
import { TabTile } from 'utils/TabTile'
import DistrictRow from './components/DistrictRow'
import FormSearch from './components/FormSearch'
import ModalorderDetail from './components/ModalOrder'
import ProvinceRow from './components/ProvinceRow'
import WardRow from './components/WardRow'
import { confirmedOrderAsync, deleteOrderAsync, deleteSomeOrdersAsync, deliveredOrderAsync, filterOrdersAsync, ordersSelector, shippedOrderAsync } from './OrdersSlice'
import './Style.css'

const PageOrders = (props) => {

    useEffect(() => {
        TabTile('Orders')
    }, [])

    const { openNotification } = props

    const order = useSelector(ordersSelector)

    const dispatch = useDispatch()

    const [formSearchOrder] = useForm()


    const [hiddenColumn, setHiddenColumn] = useState(true)

    const [deleteSome, setDeleteSome] = useState(false)

    const [listIdOrders, setListIdOrders] = useState([])

    const [isModalOrderOpen, setIsModalOrderOpen] = useState(false)

    const [listProductsOfOrder, setListProductOfOrder] = useState([])

    const [paging, setPaging] = useState({
        pageIndex: 1,
        pageSize: 10
    })

    // rowSelection objects indicates the need for row selection
    const rowSelection = {
        onChange: (selectedRows) => {
            if (selectedRows.length === 0) {
                setDeleteSome(false)
                setListIdOrders([])
            } else {
                setDeleteSome(true)
                setListIdOrders(selectedRows);
            }
        }
    };

    const handleOpenModalOrder = (record) => {
        setIsModalOrderOpen(true)
        setListProductOfOrder(record.orderLines)
    }

    const handleChangePage = (page) => {
        setPaging(
            {
                ...formSearchOrder.getFieldsValue(),
                pageIndex: page.current,
                pageSize: 10
            }
        )
    }

    const filterOrders = async (values) => {
        const response = await dispatch(filterOrdersAsync(values))
        console.log(response)
    }

    const handleUpdateOrder = async (value, record) => {
        switch (value) {
            case STATUS_ORDER.CONFIRMED:
                const confrimed = await dispatch(confirmedOrderAsync(record.id))
                if (confrimed.payload.success) {
                    openNotification(confrimed.payload.message, 'success')
                } else {
                    openNotification(confrimed.payload.message, 'error')
                }
                break;
            case STATUS_ORDER.SHIPPED:
                const shipped = await dispatch(shippedOrderAsync(record.id))
                if (shipped.payload.success) {
                    openNotification(shipped.payload.message, 'success')
                } else {
                    openNotification(shipped.payload.message, 'error')
                }
                break;
            case STATUS_ORDER.DELIVERED:
                const delivered = await dispatch(deliveredOrderAsync(record.id))
                if (delivered.payload.success) {
                    openNotification(delivered.payload.message, 'success')
                } else {
                    openNotification(delivered.payload.message, 'error')
                }
                break;
            default:
                openNotification("Error system :(((", 'error')
                break;
        }
    }

    const handleDeleteOrder = async (record) => {
        const response = await dispatch(deleteOrderAsync(record.id))
        if (response.payload.success) {
            setPaging({
                pageIndex: 1,
                pageSize: 10
            })
            openNotification(response.payload.message, 'success')
        } else {
            openNotification(response.payload.message, 'error')
        }
    }

    const handleDeleteSomeOrders = async () => {
        const response = await dispatch(deleteSomeOrdersAsync(listIdOrders))
        if (response.payload.success) {
            setPaging({
                pageIndex: 1,
                pageSize: 10
            })
            setDeleteSome(false)
            setListIdOrders([])
            openNotification(response.payload.message, 'success')
        } else {
            openNotification(response.payload.message, 'error')
        }
    }

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            disabled: true
        },
        {
            title: 'STT',
            dataIndex: 'STT',
            key: 'STT',
            render: (_, record, index) => {
                return <p>
                    {((paging.pageIndex - 1) * paging.pageSize) + index + 1}
                </p>
            },
            width: 60,
            align: 'center'
        }, {
            title: 'Order Date',
            dataIndex: 'orderDate',
            key: 'orderDate',
            width: 160,
            align: 'center',
            hidden: hiddenColumn,
            ellipsis: true,
            render: (_, record) => <p>{ConvertDateHaveHour(record.orderDate)}</p>,
        }, {
            title: 'Delivery Date',
            dataIndex: 'deliveryDate',
            key: 'deliveryDate',
            width: 160,
            align: 'center',
            ellipsis: true,
            hidden: hiddenColumn,
            render: (_, record) => {
                if (record.deliveryDate !== null) {
                    return ConvertDateHaveHour(record.deliveryDate)
                } else {
                    return <p>...</p>
                }
            },
        }, {
            title: 'Receiving Date',
            dataIndex: 'receivingDate',
            key: 'receivingDate',
            width: 160,
            align: 'center',
            hidden: hiddenColumn,
            ellipsis: true,
            render: (_, record) => {
                if (record.receivingDate !== null) {
                    return ConvertDateHaveHour(record.receivingDate)
                } else {
                    return <p>...</p>
                }
            },
        }, {
            title: 'Order By',
            dataIndex: 'email',
            key: 'email',
            width: 180,
            ellipsis: true
        }, {
            title: 'Full Name',
            dataIndex: 'fullName',
            key: 'fullName',
            width: 180,
            ellipsis: true,
            hidden: hiddenColumn
        }, {
            title: 'Phone Number',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            width: 130,
            align: 'center'
        }, {
            title: 'Alternate Phone',
            dataIndex: 'alternatePhone',
            key: 'alternatePhone',
            width: 135,
            hidden: hiddenColumn,
            align: 'center'
        }, {
            title: 'Payment',
            dataIndex: 'paymentMethod',
            key: 'paymentMethod',
            width: 100,
            align: 'center',
            hidden: hiddenColumn
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'adrress',
            ellipsis: true,
            width: 220,
            hidden: hiddenColumn
        }, {
            title: 'Ward',
            dataIndex: 'ward',
            key: 'ward',
            width: 180,
            hidden: hiddenColumn,
            render: (_, record) => <WardRow district={record.district} ward={record.ward} />,
        }, {
            title: 'District',
            dataIndex: 'district',
            key: 'district',
            width: 180,
            hidden: hiddenColumn,
            render: (_, record) => <DistrictRow province={record.province} district={record.district} />,
        }, {
            title: 'Province',
            dataIndex: 'province',
            key: 'province',
            width: 180,
            render: (_, record) => <ProvinceRow province={record.province} />,
        }, {
            title: 'Transport Fee',
            dataIndex: 'transportFee',
            key: 'transportFee',
            align: 'center',
            width: 120,
            render: (_, record) => <p>{record.transportFee !== 0 ? <>{record.transportFee.toLocaleString()}<sup>đ</sup></> : 'Free'}</p>
        }, {
            title: 'Total Price',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            align: 'center',
            width: 120,
            render: (_, record) => <p>{record.totalPrice.toLocaleString()}<sup>đ</sup></p>
        }, {
            title: 'Notes',
            dataIndex: 'notes',
            key: 'notes',
            width: 180,
            ellipsis: true,
        }, {
            title: 'Order Status',
            dataIndex: 'statusOrder',
            key: 'statusOrder',
            width: 140,
            align: 'center',
            render: (_, record) => {
                const index = LIST_ORDER_STATUS.findIndex(item => item['value'] === record.statusOrder)
                const listStatusOrders = LIST_ORDER_STATUS.slice(index)
                return <Select
                    options={listStatusOrders}
                    defaultValue={record.statusOrder}
                    onChange={(value) => handleUpdateOrder(value, record)}
                    style={{ width: '100%' }} />
            }
        }, {
            title: 'Action',
            key: 'action',
            width: 100,
            align: 'center',
            render: (_, record) => (
                <div className="text-[21px] flex items-center">
                    <i
                        title="Order Line"
                        className="fa-solid fa-image cursor-pointer mx-2 text-green-500 duration-150 ease-linear hover:text-green-300"
                        onClick={() => handleOpenModalOrder(record)}
                    >
                    </i>
                    <Popconfirm
                        title="Delete this order"
                        description="Are you sure to delete this product?"
                        onConfirm={() => handleDeleteOrder(record)}
                        okText="Yes"
                        cancelText="No"
                        disabled={deleteSome}
                    >
                        <i
                            title="Delete"
                            className={`fa-solid fa-trash-can ${!deleteSome ? 'cursor-pointer hover:text-red-400' : 'cursor-no-drop'} mx-2 text-red-custom`}></i>
                    </Popconfirm>
                </div>
            ),
        },
    ].filter(item => !item.hidden && !item.disabled)

    useEffect(() => {
        filterOrders(paging)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paging, order.orderItem])

    return <Spin tip="Loading" size="large" spinning={order.isLoading || order.isLoadListOrders}>
        <div className='page-orders h-screen px-4 pb-7 pt-[15px] bg-white'>
            <FormSearch
                hiddenColumn={hiddenColumn}
                setHiddenColumn={setHiddenColumn}
                setPaging={setPaging}
                formSearchOrder={formSearchOrder} />

            <div className='text-right mt-3'>
                <Popconfirm
                    title="Delete the task"
                    description="Are you sure to delete this list orders?"
                    onConfirm={handleDeleteSomeOrders}
                    okText="Yes"
                    cancelText="No"
                    disabled={!deleteSome}
                >
                    <button
                        className={`${deleteSome ? 'custom-btn' : 'btn-disabled'} px-7 py-[5px] mr-3 text-[14px] rounded-[8px]`}
                    >
                        Delete
                    </button>
                </Popconfirm>
            </div>

            <Table
                style={{
                    marginTop: 20
                }}
                columns={columns}
                dataSource={order.listOrders}
                scroll={{ x: "150" }}
                rowKey='id'
                onChange={handleChangePage}
                pageIndex={paging.pageIndex}
                pagination={{
                    total: order.totalOrder,
                    current: paging.pageIndex,
                    pageSize: paging.pageSize,
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} products`
                }}
                rowSelection={rowSelection}
            />

            <ModalorderDetail
                isModalOrderOpen={isModalOrderOpen}
                setIsModalOrderOpen={setIsModalOrderOpen}
                listProductsOfOrder={listProductsOfOrder}
                setListProductOfOrder={setListProductOfOrder} />
        </div>
    </Spin>
}

export default PageOrders