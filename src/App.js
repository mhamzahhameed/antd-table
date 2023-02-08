import {
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Table,
  Typography,
  Button,
  Modal,
} from "antd";
import { useState } from "react";
import "./App.css";
const originData = [];
for (let i = 0; i < 100; i++) {
  originData.push({
    key: i.toString(),
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  });
}
// const EditableCell = ({
//   editing,
//   dataIndex,
//   title,
//   inputType,
//   record,
//   index,
//   children,
//   ...restProps
// }) => {
//   const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
//   return (
//     <td {...restProps}>
//       {editing ? (
//         <Form.Item
//           name={dataIndex}
//           style={{
//             margin: 0,
//           }}
//           rules={[
//             {
//               required: true,
//               message: `Please Input ${title}!`,
//             },
//           ]}
//         >
//           {inputNode}
//         </Form.Item>
//       ) : (
//         children
//       )}
//     </td>
//   );
// };
const App = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState(originData);
  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record) => record.key === editingKey;
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");

  const showModal = (record) => {
    const modalData = [
      {
        key: record.key,
        name: (
          <Form.Item
            name='name'
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
          >
            <Input />
          </Form.Item>
        ),
        age: (
          <Form.Item
            name='age'
            rules={[
              {
                required: true,
                message: "Please input your age!",
              },
            ]}
          >
            <Input />
          </Form.Item>
        ),
        address: (
          <Form.Item
            name='address'
            rules={[
              {
                required: true,
                message: "Please input your address!",
              },
            ]}
          >
            <Input />
          </Form.Item>
        ),
      },
    ];
    setOpen(true);
    setModalText(
      <Form form={form}>
        <Table
          columns={modalColumns}
          dataSource={modalData}
          pagination={false}
          // rowClassName='editable-row'
        />
      </Form>
    );
    edit(record);

    console.log(record);
  };

  const modalColumns = [
    {
      title: "name",
      dataIndex: "name",
      width: "25%",
      editable: true,
    },
    {
      title: "age",
      dataIndex: "age",
      width: "15%",
      editable: true,
    },
    {
      title: "address",
      dataIndex: "address",
      width: "40%",
      editable: true,
    },
  ];
  // const handleOk = () => {
  //   setModalText("The modal will be closed after two seconds");
  //    setConfirmLoading(true);
  //    setTimeout(() => {
  //      setOpen(false);
  //      setConfirmLoading(false);
  //    }, 1000);
  // };
  const handleCancel = () => {
    setEditingKey("");
    setOpen(false);
  };
  const edit = (record) => {
    form.setFieldsValue({
      name: "",
      age: "",
      address: "",
      ...record,
    });
    console.log("edit key : ", record.key);
    setEditingKey(record.key);
    console.log("editingkey :", editingKey);
    console.log("isediting :", isEditing(record));
  };
  const cancel = () => {
    setEditingKey("");
  };
  const save = async (key) => {
    console.log("save: ", key);
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      console.log(index);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
    setOpen(false);

    //   // setConfirmLoading(true);
    //   setTimeout(() => {
    //     // setConfirmLoading(false);
    //   }, 1000);
  };
  const handleDelete = (key) => {
    const newData = data.filter((item) => item.key !== key);
    setData(newData);
  };
  const columns = [
    {
      title: "name",
      dataIndex: "name",
      width: "25%",
      editable: true,
    },
    {
      title: "age",
      dataIndex: "age",
      width: "15%",
      editable: true,
    },
    {
      title: "address",
      dataIndex: "address",
      width: "40%",
      editable: true,
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (_, record) =>
        data.length >= 1 ? (
          <Popconfirm
            title='Sure to delete?'
            onConfirm={() => handleDelete(record.key)}
          >
            <a>Delete</a>
          </Popconfirm>
        ) : null,
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Modal
            title='Edit'
            open={open}
            onOk={() => save(record.key)}
            // confirmLoading={confirmLoading}
            onCancel={handleCancel}
          >
            {modalText}
          </Modal> // </span>
        ) : (
          //   </Popconfirm>
          //     <a>Cancel</a>
          //   <Popconfirm title='Sure to cancel?' onConfirm={cancel}>
          //   </Typography.Link>
          //     Save
          //   >
          //     }}
          //       marginRight: 8,
          //     style={{
          //     onClick={() => save(record.key)}
          //   <Typography.Link
          // <span>
          <>
            <Typography.Link
              disabled={editingKey !== ""}
              onClick={() => showModal(record)}
            >
              Edit
            </Typography.Link>
          </>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <Table
      // components={{
      //   body: {
      //     cell: EditableCell,
      //   },
      // }}
      bordered
      dataSource={data}
      columns={mergedColumns}
      rowClassName='editable-row'
      pagination={{
        onChange: cancel,
      }}
    />
  );
};
export default App;
