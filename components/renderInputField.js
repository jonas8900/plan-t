import styled from "styled-components";

export default function RenderInputField({name, label, type, placeholder, formData, handleChange, required, ...additionalProps}) {
    return(
        <InputContainer>
          <StyledLabel htmlFor={name}>{label}{required && "*"}</StyledLabel>
          <StyledInput
            type={type}
            id={name}
            name={name}
            placeholder={placeholder}
            value={formData[name]}
            onChange={handleChange}
            required={required}
            {...additionalProps}
          />
        </InputContainer>
    )
}


const StyledLabel = styled.label`
  color: var(--dark-font-color);
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 1.2rem 0;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #CECECE;
  border-radius: 5px;
  font-family: poppins;
  font-size: 0.9rem;
`;