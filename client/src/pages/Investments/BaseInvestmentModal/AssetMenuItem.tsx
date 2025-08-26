import styled from "styled-components";
import { COLORS, FONTSIZE, SPACING } from "theme";
import { Asset } from "types/investment";
import { formatToCurrency } from "utils/index";

type AssetMenuItemProps = {
  asset: Asset;
};

export default function AssetMenuItem({ asset }: AssetMenuItemProps) {
  const fields = [
    { label: "Name", value: asset.name },
    { label: "Exchange", value: asset.exchange },
  ].filter(({ value }) => !!value);

  const price = asset.history[0]?.price
    ? formatToCurrency(asset.history[0].price)
    : "";

  return (
    <Container>
      <Name>
        {" "}
        {asset.symbol} - {price}
      </Name>
      <FieldsContainer>
        {fields.map(({ label, value }) => (
          <FieldContainer key={label}>
            <FieldLabel>{label}:</FieldLabel>
            <FieldValue>{String(value)}</FieldValue>
          </FieldContainer>
        ))}
      </FieldsContainer>
    </Container>
  );
}

const Container = styled.div`
  width: 615px;
  border-bottom: 1px solid ${COLORS.mediumGrey};
  padding: ${SPACING.spacing4x};
`;

const Name = styled.h3`
  font-size: ${FONTSIZE.md};
  width: 585px;
  flex: 1;
  margin: 0 0 ${SPACING.spacing4x} 0;
  padding-bottom: ${SPACING.spacing2x};
  border-bottom: 1px solid ${COLORS.lightGrey};
`;

const FieldsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${SPACING.spacing2x};
  max-width: 700px;
  overflow: hidden;
`;

const FieldContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex: 1 1 30%;
  min-width: 0;
  font-size: ${FONTSIZE.sm};
`;

const FieldLabel = styled.span`
  font-weight: bold;
  white-space: nowrap;
  margin-right: ${SPACING.spacing2x};
`;

const FieldValue = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  min-width: 0;
`;
