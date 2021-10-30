import {
  Button,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useEffect, useState } from "react";

interface User {
  action: any;
  id: any;
  firstname: string;
  lastname: string;
  email: any;
  setstate: any;
}

// style
const TypographyStyle = styled(Typography)`
  margin: 10px auto;
  color: #ffff;
  font-family: "Varela Round", sans-serif;
  font-size: 2rem;
  font-weight: 600;
  text-align: center;
  justify-content: center;
`;
const PaperStyle = styled(Paper)`
  margin: 50px;
  padding: 10px;
  background-color: #a1c0b9;
  display: flex-wrap;
`;

const ButtonStyle = styled(Button)`
  background-color: #435ef3;
  font-family: "Varela Round", sans-serif;
  font-size: 14px;
  color: #fff;
  display: flex-wrap;
  margin: 12px;

  &:hover {
    background-color: #293783;
  }
`;

const TableRowStyle = styled(TableRow)`
  background-color: #484a47;
`;

const TableCellStyle = styled(TableCell)`
  color: #fff;
  font-family: "Varela Round", sans-serif;
  font-weight: 300;
`;

const BoxStyle = styled(Box)`
  border-radius: 5px;
  margin: 30px 10px;
`;

const BoxChangeStyle = styled(Box)`
  margin: 10px 10px;
  padding: 10px 20px;
  display: flex-wrap;
`;

const TextFieldStyle = styled(TextField)`
  margin: 6px;
`;

// style

function Users(props: User) {
  const [user, setUser] = useState<User[]>([]);
  const [firstname, setFirstName] = useState<string>();
  const [lastname, setLastName] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [trash, setTrash] = useState<any>();

  const firstName = (event: React.ChangeEvent<any>) => {
    const value = event.target.value;
    setFirstName(value);
  };
  const lastName = (event: React.ChangeEvent<any>) => {
    const value = event.target.value;
    setLastName(value);
  };
  const emailChange = (event: React.ChangeEvent<any>) => {
    const value = event.target.value;
    setEmail(value);
  };

  function onGetButton() {
    return axios
      .get<User[]>("http://localhost:3001/user?content-type=application/json")
      .then((response) => {
        setUser(response.data);
      });
  }

  console.log(user);

  function onPostButton(e: { preventDefault: () => void }) {
    e.preventDefault();
    const postData = {
      firstname,
      lastname,
      email,
    };

    if (!firstname || !lastname || !email) {
      throw new Error("Error");
    }

    return axios
      .post<User>(
        "http://localhost:3001/user?content-type=application/posts.json",
        postData
      )
      .then((response: any) => {
        // console.log("response", response.data);
        setUser((prevState: any) => {
          return prevState.concat(response.data);
        });
      });
  }
  const onDeleteButton = (id: any) => {
    setTrash(id);
  };

  useEffect(() => {
    if (trash) {
      axios
        .delete<User[]>(`http://localhost:3001/user/${trash}`)
        .then((response) => {
          setUser((prevState: any) => {
            // console.log("prevState", prevState);
            return prevState.filter((item: any) => item.id !== trash);
          });
        });
    }
  }, [trash]);

  return (
    <PaperStyle>
      <TypographyStyle>TODO LIST</TypographyStyle>
      <BoxStyle>
        <TextFieldStyle
          id="demo-helper-text-aligned"
          label="Firstname"
          onChange={firstName}
          name={"firstname"}
        />
        <TextFieldStyle
          id="demo-helper-text-aligned-no-helper"
          label="Lastname"
          onChange={lastName}
        />
        <TextFieldStyle
          id="demo-helper-text-aligned-no-helper"
          label="Email-Id"
          onChange={emailChange}
        />
        <ButtonStyle onClick={onPostButton}>Post</ButtonStyle>
        <ButtonStyle onClick={onGetButton}>Get</ButtonStyle>
      </BoxStyle>
      <BoxChangeStyle>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 300 }} aria-label=" dense table">
            <TableHead>
              <TableRowStyle>
                <TableCellStyle>User-Id</TableCellStyle>
                <TableCellStyle>FirstName</TableCellStyle>
                <TableCellStyle>LastName</TableCellStyle>
                <TableCellStyle>Email</TableCellStyle>
                <TableCellStyle>Action</TableCellStyle>
              </TableRowStyle>
            </TableHead>
            <TableBody>
              {user.map((row) => (
                <TableRow key={row.id.toString()}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.firstname}</TableCell>
                  <TableCell>{row.lastname}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>
                    {row.action}
                    <ButtonStyle onClick={() => onDeleteButton(row.id)}>
                      Delete
                    </ButtonStyle>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </BoxChangeStyle>
    </PaperStyle>
  );
}

export default Users;
