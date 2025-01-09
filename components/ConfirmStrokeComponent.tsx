"use client";

import Button from "./Button";

export type ConfirmStrokeComponentProps = {
  emergencyId: string;
};


export default function ConfirmStrokeComponent({emergencyId}: ConfirmStrokeComponentProps) {
  return (
    <div className="w-10/12 max-w-md mx-auto flex flex-col space-y-4">
      <Button title="Confirmar Stroke" onClick={() => {console.log(`Click red on ${emergencyId}`)}} color='red' />
      <Button title="Descartar Stroke" onClick={() => {console.log(`Click green on ${emergencyId}`)}} color="green" />
    </div>
  )
}
