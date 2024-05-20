import { Badge } from "@material-ui/core";
import { Search, ShoppingCartOutlined } from "@material-ui/icons";
import React, { useState } from "react";
import styled from "styled-components";
import { mobile } from "../responsive";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../redux/userRedux";
import { resetCart } from "../redux/cartRedux";

const Container = styled.div`
  height: 60px;
  ${mobile({ height: "50px" })}
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 10;
  background-color: white;
`;

const Wrapper = styled.div`
  padding: 0px 20px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${mobile({ padding: "10px 0px" })}
`;

const Left = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`;

const Language = styled.span`
  font-size: 14px;
  cursor: pointer;
  ${mobile({ display: "none" })}
`;

const SearchContainer = styled.div`
  border: 0.5px solid lightgray;
  display: flex;
  align-items: center;
  margin-left: 25px;
  padding: 5px;
  &:focus-within {
    border-color: black;
  }
`;

const Input = styled.input`
  border: none;
  padding: 5px;
  ${mobile({ width: "50px" })}
  
  &:focus{
    outline: none;
  }
`;

const Center = styled.div`
  flex: 1;
  text-align: center;
`;

const Logo = styled.h1`
  font-weight: bold;
  ${mobile({ fontSize: "24px" })}
`;
const Right = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  ${mobile({ flex: 2, justifyContent: "center" })}
`;

const MenuItem = styled.div`
  font-size: 14px;
  cursor: pointer;
  margin-left: 25px;
  ${mobile({ fontSize: "12px", marginLeft: "10px" })}
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const Navbar = () => {
  // const storedUsername = localStorage.getItem("username");
  const [searchQuery, setSearchQuery] = useState("");
  const quantity = useSelector((state) => state.cart.quantity);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    dispatch(resetCart());
    dispatch(logout());
  };
  const user = useSelector((state) => state.user.currentUser);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log(searchQuery);
    if (searchQuery.trim()) {
      navigate(`/products/${searchQuery}`);
    }
  };
  return (
    <Container>
      <Wrapper>
        <Left>
          <Language>EN</Language>
          <SearchContainer onSubmit={handleSearch}>
            <Input
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              style={{ border: "none", background: "none", cursor: "pointer" }}
              onClick={handleSearch}
            >
              <Search style={{ color: "gray", fontSize: 16 }} />
            </button>
          </SearchContainer>
        </Left>
        <Center>
          <StyledLink to="/">
            <Logo>COSMOS.</Logo>
          </StyledLink>
        </Center>
        <Right>
          {user ? (
            <>
              <MenuItem>Hello {user.username}</MenuItem>
              <StyledLink onClick={handleLogout} to="/login">
                <MenuItem>LogOut</MenuItem>
              </StyledLink>
            </>
          ) : (
            <>
              <StyledLink to="/register">
                <MenuItem>REGISTER</MenuItem>
              </StyledLink>
              <StyledLink to="/login">
                <MenuItem>SIGN IN</MenuItem>
              </StyledLink>
            </>
          )}
          <MenuItem>
            <StyledLink to={user ? "/cart" : "/login"}>
              <Badge badgeContent={quantity} color="primary">
                <ShoppingCartOutlined />
              </Badge>
            </StyledLink>
          </MenuItem>
        </Right>
      </Wrapper>
    </Container>
  );
};

export default Navbar;
