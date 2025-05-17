<?php

class Cliente extends TRecord
{
    const TABLENAME  = 'cliente';
    const PRIMARYKEY = 'cliente_id';
    const IDPOLICY   =  'serial'; // {max, serial}

    

    /**
     * Constructor method
     */
    public function __construct($id = NULL, $callObjectLoad = TRUE)
    {
        parent::__construct($id, $callObjectLoad);
        parent::addAttribute('nome');
        parent::addAttribute('cpf_cnpj');
        parent::addAttribute('inscricao_estadual');
        parent::addAttribute('cep');
        parent::addAttribute('logradouro');
        parent::addAttribute('numero');
        parent::addAttribute('complemento');
        parent::addAttribute('bairro');
        parent::addAttribute('nome_municipio');
        parent::addAttribute('codigo_municipio');
        parent::addAttribute('indicador_ie');
        parent::addAttribute('telefone');
        parent::addAttribute('uf');
            
    }

    /**
     * Method getVendas
     */
    public function getVendas()
    {
        $criteria = new TCriteria;
        $criteria->add(new TFilter('cliente_id', '=', $this->cliente_id));
        return Venda::getObjects( $criteria );
    }

    public function set_venda_cliente_to_string($venda_cliente_to_string)
    {
        if(is_array($venda_cliente_to_string))
        {
            $values = Cliente::where('cliente_id', 'in', $venda_cliente_to_string)->getIndexedArray('nome', 'nome');
            $this->venda_cliente_to_string = implode(', ', $values);
        }
        else
        {
            $this->venda_cliente_to_string = $venda_cliente_to_string;
        }

        $this->vdata['venda_cliente_to_string'] = $this->venda_cliente_to_string;
    }

    public function get_venda_cliente_to_string()
    {
        if(!empty($this->venda_cliente_to_string))
        {
            return $this->venda_cliente_to_string;
        }
    
        $values = Venda::where('cliente_id', '=', $this->cliente_id)->getIndexedArray('cliente_id','{cliente->nome}');
        return implode(', ', $values);
    }

    
}

