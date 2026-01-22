import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

interface groupType{
    label: string,
    buttonText: string,
    placeholder: string
}

export function InputButtonGroup({label, buttonText, placeholder}: groupType) {
    return (
        <Field>
        <FieldLabel htmlFor="input-button-group">{label}</FieldLabel>
        <ButtonGroup>
            <Input id="input-button-group" placeholder={placeholder} />
            <Button variant="outline">{buttonText}</Button>
        </ButtonGroup>
        </Field>
    )
}
