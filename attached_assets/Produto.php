<?php

class Produto extends TRecord
{
    const TABLENAME  = 'produto';
    const PRIMARYKEY = 'produto_id';
    const IDPOLICY   =  'serial'; // {max, serial}

    

    /**
     * Constructor method
     */
    public function __construct($id = NULL, $callObjectLoad = TRUE)
    {
        parent::__construct($id, $callObjectLoad);
        parent::addAttribute('descricao');
        parent::addAttribute('valor_venda');
        parent::addAttribute('unidade');
        parent::addAttribute('ncm');
        parent::addAttribute('origem');
        parent::addAttribute('cest');
            
    }

    /**
     * Method getVendaItems
     */
    public function getVendaItems()
    {
        $criteria = new TCriteria;
        $criteria->add(new TFilter('produto_id', '=', $this->produto_id));
        return VendaItem::getObjects( $criteria );
    }

    public function set_venda_item_produto_to_string($venda_item_produto_to_string)
    {
        if(is_array($venda_item_produto_to_string))
        {
            $values = Produto::where('produto_id', 'in', $venda_item_produto_to_string)->getIndexedArray('descricao', 'descricao');
            $this->venda_item_produto_to_string = implode(', ', $values);
        }
        else
        {
            $this->venda_item_produto_to_string = $venda_item_produto_to_string;
        }

        $this->vdata['venda_item_produto_to_string'] = $this->venda_item_produto_to_string;
    }

    public function get_venda_item_produto_to_string()
    {
        if(!empty($this->venda_item_produto_to_string))
        {
            return $this->venda_item_produto_to_string;
        }
    
        $values = VendaItem::where('produto_id', '=', $this->produto_id)->getIndexedArray('produto_id','{produto->descricao}');
        return implode(', ', $values);
    }

    public function set_venda_item_venda_to_string($venda_item_venda_to_string)
    {
        if(is_array($venda_item_venda_to_string))
        {
            $values = Venda::where('venda_id', 'in', $venda_item_venda_to_string)->getIndexedArray('venda_id', 'venda_id');
            $this->venda_item_venda_to_string = implode(', ', $values);
        }
        else
        {
            $this->venda_item_venda_to_string = $venda_item_venda_to_string;
        }

        $this->vdata['venda_item_venda_to_string'] = $this->venda_item_venda_to_string;
    }

    public function get_venda_item_venda_to_string()
    {
        if(!empty($this->venda_item_venda_to_string))
        {
            return $this->venda_item_venda_to_string;
        }
    
        $values = VendaItem::where('produto_id', '=', $this->produto_id)->getIndexedArray('venda_id','{venda->venda_id}');
        return implode(', ', $values);
    }

    
}

